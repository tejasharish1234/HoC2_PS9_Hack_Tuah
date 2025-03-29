import os
import pandas as pd
import numpy as np
import ollama
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class DDIAnalyzer:
    def __init__(self, csv_path, model_name='llama2'):
        """
        Initialize DDI Analyzer with CSV data and Ollama model
        
        :param csv_path: Path to Drug-Drug Interaction dataset
        :param model_name: Ollama model to use for analysis
        """
        # Load drug interaction dataset
        self.df = pd.read_csv(csv_path)
        self.df = self.df.dropna()  # Remove empty rows
        
        # Prepare RAG context
        self.prepare_context()
        
        # Set Ollama model
        self.model_name = model_name
    
    def prepare_context(self):
        """
        Prepare context for Retrieval Augmented Generation (RAG)
        """
        # Combine drug names and interaction descriptions for vectorization
        self.df['context'] = self.df['Drug 1'] + ' ' + self.df['Drug 2'] + ' ' + self.df['Interaction Description']
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer()
        self.context_vectors = self.vectorizer.fit_transform(self.df['context'])
    
    def retrieve_similar_interactions(self, drug1, drug2, top_k=3):
        """
        Retrieve most similar drug interactions from the dataset
        
        :param drug1: First drug name
        :param drug2: Second drug name
        :param top_k: Number of similar interactions to retrieve
        :return: List of similar interaction descriptions
        """
        # Create query vector
        query = f"{drug1} {drug2}"
        query_vector = self.vectorizer.transform([query])
        
        # Calculate cosine similarity
        similarities = cosine_similarity(query_vector, self.context_vectors)[0]
        
        # Get top-k similar interaction indices
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        return [self.df.iloc[idx]['Interaction Description'] for idx in top_indices]
    
    def analyze_drug_interaction(self, drug1, drug2):
        """
        Analyze potential drug-drug interactions using LLM and RAG
        
        :param drug1: First drug name
        :param drug2: Second drug name
        :return: Interaction analysis result
        """
        # Retrieve similar interactions for context
        context_interactions = self.retrieve_similar_interactions(drug1, drug2)
        
        # Prepare prompt for Ollama
        prompt = f"""Analyze the potential drug-drug interaction between {drug1} and {drug2}.
        
        Context of similar interactions:
        {chr(10).join(context_interactions)}
        
        Based PRIMARILY on the above dataset information, provide a comprehensive analysis including:
        1. Potential interaction risks and severity of interaction (None/Low/Medium/High/Severe)
        2. Recommended alternatives 

        Your response should be evidence-based, concise, and focus on patient safety. Include two references at the end."""
        
        try:
            # Use Ollama to generate interaction analysis
            response = ollama.chat(model=self.model_name, messages=[
                {
                    'role': 'system', 
                    'content': 'You are a medical expert specializing in pharmacology and drug interactions.'
                },
                {
                    'role': 'user', 
                    'content': prompt
                }
            ])
            
            return response['message']['content']
        
        except Exception as e:
            return f"Error analyzing interaction: {str(e)}"
    
    def batch_interaction_analysis(self, top_n=10):
        """
        Perform batch analysis of drug interactions
        
        :param top_n: Number of interactions to analyze
        :return: DataFrame with interaction analyses
        """
        # Select top N unique drug pairs
        unique_pairs = self.df[['Drug 1', 'Drug 2']].drop_duplicates().head(top_n)
        
        results = []
        for _, row in unique_pairs.iterrows():
            analysis = self.analyze_drug_interaction(row['Drug 1'], row['Drug 2'])
            results.append({
                'Drug 1': row['Drug 1'],
                'Drug 2': row['Drug 2'],
                'Interaction Analysis': analysis
            })
        
        return pd.DataFrame(results)

# Example usage
if __name__ == "__main__":
    # Ensure you have Ollama running and a model like llama2 pulled
    # ollama pull llama2
    
    ddi_analyzer = DDIAnalyzer('../data/drug_interactions.csv')
    
    # Interactive drug interaction analysis
    interaction_result = ddi_analyzer.analyze_drug_interaction('Aspirin', 'Ibuprofen')
    print(interaction_result)
    
    # Batch analysis
    batch_results = ddi_analyzer.batch_interaction_analysis()
    print(batch_results)