import { LogisticRegressionEngine, normalizeFeature } from './MLRecommendationEngine';

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  contact: string;
}

export interface NetworkMedicine {
  id: string;
  pharmacyId: string;
  medicineName: string;
  composition: string;
  stockQuantity: number;
  expiryDate: string;
  demandFrequency: number;
  recommendationScore?: number;
}

export interface NetworkSearchResult {
  pharmacy: Pharmacy;
  medicine: NetworkMedicine;
}

const mockPharmacies: Pharmacy[] = [
  { id: '1', name: 'MediCare Heights', location: '123 Health Ave, North District', distance: 1.2, contact: '(555) 123-4567' },
  { id: '2', name: 'City Central Pharmacy', location: '89 Main St, Downtown', distance: 2.5, contact: '(555) 987-6543' },
  { id: '3', name: 'Wellness Plus Pharma', location: '445 Oak Road, Westside', distance: 3.8, contact: '(555) 456-7890' },
  { id: '4', name: 'Neighborhood Rx', location: '12 Maple Drive, Eastgate', distance: 0.8, contact: '(555) 222-3333' }
];

// Helper to generate a date string
const getFutureDate = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

const commonMeds = [
  { name: 'Paracetamol', comp: 'Paracetamol 500mg' },
  { name: 'Amoxicillin', comp: 'Amoxicillin 250mg' },
  { name: 'Ibuprofen', comp: 'Ibuprofen 400mg' },
  { name: 'Aspirin', comp: 'Acetylsalicylic acid 75mg' },
  { name: 'Cetirizine', comp: 'Cetirizine 10mg' },
  { name: 'Pantoprazole', comp: 'Pantoprazole 40mg' },
  { name: 'Metformin', comp: 'Metformin 500mg' },
  { name: 'Amlodipine', comp: 'Amlodipine 5mg' },
  { name: 'Atorvastatin', comp: 'Atorvastatin 20mg' },
  { name: 'Omeprazole', comp: 'Omeprazole 20mg' },
];

const mockNetworkStock: NetworkMedicine[] = [];

// Seed stock data across pharmacies
mockPharmacies.forEach(pharmacy => {
  commonMeds.forEach(med => {
    // Random stock quantity per pharmacy (0 to 200)
    const stock = Math.floor(Math.random() * 200);
    // Add variations for realism, not all pharmacies have all meds
    if (Math.random() > 0.3 && stock > 0) {
      mockNetworkStock.push({
        id: crypto.randomUUID(),
        pharmacyId: pharmacy.id,
        medicineName: med.name,
        composition: med.comp,
        stockQuantity: stock,
        expiryDate: getFutureDate(Math.floor(Math.random() * 24) + 6),
        demandFrequency: Math.floor(Math.random() * 100)
      });
    }
  });

  // some random extras
  mockNetworkStock.push({
    id: crypto.randomUUID(),
    pharmacyId: pharmacy.id,
    medicineName: `Specialty Med ${Math.floor(Math.random() * 10)}`,
    composition: 'Complex Composition',
    stockQuantity: Math.floor(Math.random() * 50) + 5,
    expiryDate: getFutureDate(12),
    demandFrequency: Math.floor(Math.random() * 100)
  });
});

const mlEngine = new LogisticRegressionEngine();

const trainModel = () => {
  const features: number[][] = [];
  const labels: number[] = [];

  const maxDist = Math.max(...mockPharmacies.map(p => p.distance));
  const maxStock = Math.max(...mockNetworkStock.map(m => m.stockQuantity));
  const maxDemand = 100;

  mockNetworkStock.forEach(med => {
    const ph = mockPharmacies.find(p => p.id === med.pharmacyId);
    if (!ph) return;

    // Feature scaling (invert distance so higher = closer = better)
    const normDist = normalizeFeature(maxDist - ph.distance, 0, maxDist);
    const normStock = normalizeFeature(med.stockQuantity, 0, maxStock);
    const normDemand = normalizeFeature(med.demandFrequency, 0, maxDemand);

    features.push([normDist, normStock, normDemand]);

    // Synthetic Target:
    // If it's close (< 2.0 km), has good stock (> 30), and high demand (> 40), then it's a good recommendation
    const isGood = (ph.distance < 2.0 && med.stockQuantity > 30 && med.demandFrequency > 40) ? 1 : 0;
    labels.push(isGood);
  });

  mlEngine.train(features, labels, 2000, 0.5);
};
trainModel();


export const NetworkStockService = {
  searchNetworkStock: async (query: string): Promise<NetworkSearchResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) {
          resolve([]);
          return;
        }

        const results: NetworkSearchResult[] = [];
        
        // Find matching medicines
        const matchingMeds = mockNetworkStock.filter(m => 
          m.medicineName.toLowerCase().includes(lowerQuery) || 
          m.composition.toLowerCase().includes(lowerQuery)
        );

        const maxDist = Math.max(...mockPharmacies.map(p => p.distance));
        const maxStock = Math.max(...mockNetworkStock.map(m => m.stockQuantity));
        
        matchingMeds.forEach(med => {
          const ph = mockPharmacies.find(p => p.id === med.pharmacyId);
          if (ph) {
            const normDist = normalizeFeature(maxDist - ph.distance, 0, maxDist);
            const normStock = normalizeFeature(med.stockQuantity, 0, maxStock);
            const normDemand = normalizeFeature(med.demandFrequency, 0, 100);

            const score = mlEngine.predict([normDist, normStock, normDemand]);
            med.recommendationScore = score;

            results.push({
              pharmacy: ph,
              medicine: med
            });
          }
        });

        resolve(results);
      }, 600); // 600ms latency simulation
    });
  }
};
