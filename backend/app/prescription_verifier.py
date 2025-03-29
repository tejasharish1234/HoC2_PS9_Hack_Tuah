import json
import os
import sys
from app.ddi_analyzer import DDIAnalyzer

class PrescriptionVerifier:
    def __init__(self, interactions_csv):
        self.ddi_analyzer = DDIAnalyzer(interactions_csv)
    
    def verify_prescription(self, new_prescription, past_prescriptions):
        """
        Verify new prescription against past prescriptions for drug interactions
        
        :param new_prescription: Dict of new prescription drugs
        :param past_prescriptions: List of past prescription drugs
        :return: Interaction analysis results
        """
        interactions = []
        
        for new_drug in new_prescription:
            for past_drug in past_prescriptions:
                interaction = self.ddi_analyzer.analyze_drug_interaction(new_drug, past_drug)
                interactions.append({
                    'drug1': new_drug,
                    'drug2': past_drug,
                    'interaction_details': interaction
                })
        
        return interactions