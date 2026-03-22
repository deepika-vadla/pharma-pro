export class LogisticRegressionEngine {
    private weights: number[] = [0, 0, 0]; // [distance, stock, demand]
    private bias: number = 0;

    private sigmoid(z: number): number {
        return 1 / (1 + Math.exp(-z));
    }

    /**
     * Train the logistic regression model
     * @param features Array of [distance, stock, demand]
     * @param labels Array of 0 (not recommended) or 1 (recommended)
     * @param epochs Number of training iterations
     * @param lr Learning rate
     */
    public train(features: number[][], labels: number[], epochs: number = 1000, lr: number = 0.5) {
        const m = features.length;
        if (m === 0) return;

        // Initialize with small random weights
        this.weights = [Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1];
        this.bias = 0;

        for (let epoch = 0; epoch < epochs; epoch++) {
            let dw = [0, 0, 0];
            let db = 0;

            for (let i = 0; i < m; i++) {
                const x = features[i];
                const y = labels[i];
                
                const z = this.weights[0] * x[0] + this.weights[1] * x[1] + this.weights[2] * x[2] + this.bias;
                const a = this.sigmoid(z);
                const error = a - y;

                dw[0] += error * x[0];
                dw[1] += error * x[1];
                dw[2] += error * x[2];
                db += error;
            }

            this.weights[0] -= (lr / m) * dw[0];
            this.weights[1] -= (lr / m) * dw[1];
            this.weights[2] -= (lr / m) * dw[2];
            this.bias -= (lr / m) * db;
        }
        
        console.log(`[ML Engine] Trained Weights: Dist(${this.weights[0].toFixed(2)}), Stock(${this.weights[1].toFixed(2)}), Demand(${this.weights[2].toFixed(2)}), Bias(${this.bias.toFixed(2)})`);
    }

    /**
     * Predict recommendation score
     * @param features [normalizedDistance, normalizedStock, normalizedDemand]
     * @returns score from 0.0 to 1.0
     */
    public predict(features: number[]): number {
        const z = this.weights[0] * features[0] + this.weights[1] * features[1] + this.weights[2] * features[2] + this.bias;
        return this.sigmoid(z);
    }
}

export const normalizeFeature = (val: number, min: number, max: number): number => {
    if (max === min) return 0.5; // Avoid division by zero
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
};
