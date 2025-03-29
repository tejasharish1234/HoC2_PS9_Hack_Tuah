from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

# Initialize FastAPI app
app = FastAPI()

# Load Hugging Face summarization model
summarizer = pipeline("summarization", model="t5-small")

# Define request body structure
class SummarizationRequest(BaseModel):
    text: str

@app.post("/summarize/")
async def summarize_text(request: SummarizationRequest):
    try:
        summary = summarizer(request.text, max_length=150, min_length=50, do_sample=False)
        return {"summary": summary[0]["summary_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server with:
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
