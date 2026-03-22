import type { Medicine, SaleRecord } from '../hooks/useInventory';

export interface DemandPrediction {
    medicineId: string;
    predictedDemand: number; // Next 30 days
    confidence: number;
    trend: 'rising' | 'falling' | 'stable';
}

export interface ExpiryRisk {
    medicineId: string;
    riskLevel: 'low' | 'medium' | 'high';
    daysUntilExpiry: number;
    estimatedStockRemainingAtExpiry: number;
}

export interface AIInsight {
    id: string;
    type: 'reorder' | 'discount' | 'expiry' | 'trend';
    message: string;
    severity: 'info' | 'warning' | 'critical';
    actionLabel: string;
}

export class PredictiveEngine {
    private static LOOKBACK_DAYS = 30;

    /**
     * Calculates the average daily sales velocity for a medicine
     */
    private static calculateVelocity(medicineId: string, sales: SaleRecord[]): number {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - this.LOOKBACK_DAYS));

        const relevantSales = sales.filter(s =>
            s.medicineId === medicineId &&
            new Date(s.date) >= thirtyDaysAgo
        );

        const totalSold = relevantSales.reduce((sum, s) => sum + s.quantity, 0);
        return totalSold / this.LOOKBACK_DAYS;
    }

    /**
     * Predicts demand for the next 30 days
     */
    static predictDemand(medicine: Medicine, sales: SaleRecord[]): DemandPrediction {
        const velocity = this.calculateVelocity(medicine.id, sales);
        let predictedDemand = Math.ceil(velocity * 30);

        // Seasonal Adjustment based on current month and category
        const currentMonth = new Date().getMonth(); // 0 is Jan, 11 is Dec
        let seasonMultiplier = 1.0;
        
        const isWinter = currentMonth === 11 || currentMonth <= 1; // Dec, Jan, Feb
        const isSpring = currentMonth >= 2 && currentMonth <= 4;   // Mar, Apr, May
        const isSummer = currentMonth >= 5 && currentMonth <= 7;   // Jun, Jul, Aug
        
        const category = medicine.category.toLowerCase();
        
        if (isWinter && (category.includes('cold') || category.includes('flu') || category.includes('cough') || category.includes('fever'))) {
            seasonMultiplier = 1.4; // 40% increase in baseline demand
        } else if (isSpring && (category.includes('allergy') || category.includes('antihistamine'))) {
            seasonMultiplier = 1.5; // 50% increase in baseline demand
        } else if (isSummer && (category.includes('sun') || category.includes('skin') || category.includes('burn'))) {
            seasonMultiplier = 1.3; // 30% increase in baseline demand
        }

        predictedDemand = Math.ceil(predictedDemand * seasonMultiplier);

        // Simple trend analysis (comparing last 15 days vs previous 15 days)
        const now = new Date();
        const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentSales = sales.filter(s =>
            s.medicineId === medicine.id &&
            new Date(s.date) >= fifteenDaysAgo
        ).reduce((sum, s) => sum + s.quantity, 0);

        const olderSales = sales.filter(s =>
            s.medicineId === medicine.id &&
            new Date(s.date) >= thirtyDaysAgo &&
            new Date(s.date) < fifteenDaysAgo
        ).reduce((sum, s) => sum + s.quantity, 0);

        let trend: 'rising' | 'falling' | 'stable' = 'stable';
        if (recentSales > olderSales * 1.2) trend = 'rising';
        else if (recentSales < olderSales * 0.8) trend = 'falling';

        return {
            medicineId: medicine.id,
            predictedDemand,
            confidence: sales.length > 5 ? 0.85 : 0.4, // Simplified confidence
            trend
        };
    }

    /**
     * Assesses the risk of medicine expiring before it's sold
     */
    static assessExpiryRisk(medicine: Medicine, sales: SaleRecord[]): ExpiryRisk {
        const velocity = this.calculateVelocity(medicine.id, sales);
        const expiryDate = new Date(medicine.expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        const estimatedSalesUntilExpiry = velocity * Math.max(0, daysUntilExpiry);
        const stockRemaining = Math.max(0, medicine.quantity - estimatedSalesUntilExpiry);

        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (daysUntilExpiry < 30 && stockRemaining > 0) riskLevel = 'high';
        else if (daysUntilExpiry < 90 && stockRemaining > (medicine.quantity * 0.5)) riskLevel = 'medium';

        return {
            medicineId: medicine.id,
            riskLevel,
            daysUntilExpiry,
            estimatedStockRemainingAtExpiry: Math.ceil(stockRemaining)
        };
    }

    /**
     * Generates actionable insights based on predictions
     */
    static generateInsights(inventory: Medicine[], sales: SaleRecord[]): AIInsight[] {
        const insights: AIInsight[] = [];

        inventory.forEach(medicine => {
            const prediction = this.predictDemand(medicine, sales);
            const expiry = this.assessExpiryRisk(medicine, sales);

            // Reorder Insight
            if (medicine.quantity <= prediction.predictedDemand * 0.2 || medicine.quantity <= medicine.minStock) {
                insights.push({
                    id: crypto.randomUUID(),
                    type: 'reorder',
                    message: `${medicine.name} is running low. Predicted demand for next month is ${prediction.predictedDemand} units.`,
                    severity: medicine.quantity === 0 ? 'critical' : 'warning',
                    actionLabel: 'Restock Now'
                });
            }

            // Expiry Insight
            if (expiry.riskLevel === 'high') {
                insights.push({
                    id: crypto.randomUUID(),
                    type: 'discount',
                    message: `High expiry risk for ${medicine.name}. Estimated ${expiry.estimatedStockRemainingAtExpiry} units will expire.`,
                    severity: 'critical',
                    actionLabel: 'Create Clearance'
                });
            }

            // Growth Trend
            if (prediction.trend === 'rising') {
                insights.push({
                    id: crypto.randomUUID(),
                    type: 'trend',
                    message: `Demand for ${medicine.name} is increasing significantly. Consider increasing safety stock.`,
                    severity: 'info',
                    actionLabel: 'Adjust Min Stock'
                });
            }
        });

        return insights;
    }

    /**
     * Generates dummy sales data for demo purposes
     */
    static generateMockSales(inventory: Medicine[]): SaleRecord[] {
        const mockSales: SaleRecord[] = [];
        const now = new Date();

        inventory.forEach(medicine => {
            // Generate some random sales over the last 45 days
            for (let i = 0; i < 45; i++) {
                if (Math.random() > 0.6) { // 40% chance of sale each day
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);

                    const qty = Math.floor(Math.random() * 5) + 1;
                    mockSales.push({
                        id: crypto.randomUUID(),
                        medicineId: medicine.id,
                        medicineName: medicine.name,
                        quantity: qty,
                        totalPrice: qty * medicine.price,
                        date: date.toISOString()
                    });
                }
            }
        });

        return mockSales;
    }
}
