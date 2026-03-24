import { useState, useEffect, useMemo } from 'react';
import { PredictiveEngine } from '../services/PredictiveEngine';

export interface Medicine {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expiryDate: string;
    minStock: number;
    batchNumber: string;
    price: number;
    lastUpdated: string;
    supplierName?: string;
    storageLocation?: string;
}

export interface SaleRecord {
    id: string;
    medicineId: string;
    medicineName: string;
    quantity: number;
    totalPrice: number;
    date: string;
}

export const useInventory = () => {
    const [inventory, setInventory] = useState<Medicine[]>([]);
    const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);

    // Load from localStorage
    useEffect(() => {
        const savedInventory = localStorage.getItem('pharmacy_inventory');
        if (savedInventory) {
            try {
                setInventory(JSON.parse(savedInventory));
            } catch (e) {
                console.error("Failed to parse inventory", e);
            }
        }

        const savedSales = localStorage.getItem('pharmacy_sales_history');
        if (savedSales) {
            try {
                setSalesHistory(JSON.parse(savedSales));
            } catch (e) {
                console.error("Failed to parse sales history", e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('pharmacy_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('pharmacy_sales_history', JSON.stringify(salesHistory));
    }, [salesHistory]);

    // AI Insights and Predictions
    const aiInsights = useMemo(() =>
        PredictiveEngine.generateInsights(inventory, salesHistory),
        [inventory, salesHistory]);

    const getMedicinePredictions = (medicine: Medicine) => {
        return {
            demand: PredictiveEngine.predictDemand(medicine, salesHistory),
            expiry: PredictiveEngine.assessExpiryRisk(medicine, salesHistory)
        };
    };

    const generateMockHistory = () => {
        const mockSales = PredictiveEngine.generateMockSales(inventory);
        setSalesHistory(mockSales);
    };

    const addMedicine = (medicine: Omit<Medicine, 'id' | 'lastUpdated'>) => {
        const newMedicine: Medicine = {
            ...medicine,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString(),
        };
        setInventory(prev => [...prev, newMedicine]);
    };

    const updateMedicine = (id: string, updates: Partial<Medicine>) => {
        setInventory(prev => prev.map(m =>
            m.id === id ? { ...m, ...updates, lastUpdated: new Date().toISOString() } : m
        ));
    };

    const deleteMedicine = (id: string) => {
        setInventory(prev => prev.filter(m => m.id !== id));
    };

    const sellMedicine = (medicineId: string, quantity: number, pricePerUnit: number) => {
        const medicine = inventory.find(m => m.id === medicineId);
        if (!medicine || medicine.quantity < quantity) return false;

        // Update inventory
        updateMedicine(medicineId, { quantity: medicine.quantity - quantity });

        // Record sale
        const newSale: SaleRecord = {
            id: crypto.randomUUID(),
            medicineId,
            medicineName: medicine.name,
            quantity,
            totalPrice: quantity * pricePerUnit,
            date: new Date().toISOString(),
        };
        setSalesHistory(prev => [newSale, ...prev]);
        return true;
    };

    return {
        inventory,
        salesHistory,
        aiInsights,
        getMedicinePredictions,
        generateMockHistory,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        sellMedicine
    };
};

