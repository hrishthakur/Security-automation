# Import required libraries
from flask import Flask, request, jsonify  # Flask for web framework
import pandas as pd  # pandas for Excel file processing
from flask_sqlalchemy import SQLAlchemy  # SQLAlchemy for database operations
from sqlalchemy import text
import os
from dotenv import load_dotenv  # For loading environment variables
from flask_cors import CORS  # Add this import

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend communication

# Database Configuration
# Get database URL from environment variables for security
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Disable modification tracking

db = SQLAlchemy(app)  # Initialize database instance


# Create schema if it doesn't exist
def create_schema():
    with app.app_context():
        db.session.execute(text("CREATE SCHEMA IF NOT EXISTS public"))
        db.session.commit()


# Database Model Definition
class Vulnerability(db.Model):
    """
    SQLAlchemy Model for Vulnerability data
    Stores structured data extracted from VAPT reports
    Each field represents a column in the vulnerabilities table
    """

    __tablename__ = "vulnerabilities"  # Explicitly set table name

    id = db.Column(
        db.Integer, primary_key=True
    )  # Unique identifier for each vulnerability
    name = db.Column(db.String(200), nullable=False)  # Name/title of the vulnerability
    risk_description = db.Column(
        db.Text, nullable=False
    )  # Detailed description of the risk
    severity = db.Column(
        db.String(50), nullable=False
    )  # Severity level of the vulnerability
    affected_urls = db.Column(
        db.Text, nullable=False
    )  # URLs affected by the vulnerability

    def to_dict(self):
        """
        Convert model instance to dictionary format
        Useful for JSON serialization and API responses
        """
        return {
            "id": self.id,
            "name": self.name,
            "risk_description": self.risk_description,
            "severity": self.severity,
            "affected_urls": self.affected_urls,
        }


@app.route("/api/upload", methods=["POST"])
def upload_report():
    """
    API endpoint for handling VAPT report uploads
    Accepts: Excel file (.xlsx) via POST request
    Process:
    1. Validates file format and required columns
    2. Extracts vulnerability data
    3. Stores in database
    Returns: Success/error message with status code
    """
    try:
        # Validate file presence in request
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Ensure file is Excel format
        if not file.filename.endswith(".xlsx"):
            return jsonify({"error": "Only Excel (.xlsx) files are supported"}), 400

        # Read Excel file into pandas DataFrame
        df = pd.read_excel(file)

        # Define and validate required columns
        required_columns = [
            "Vulnerability Name",
            "Risk Description",
            "Severity",
            "Affected URLs",
        ]
        if not all(col in df.columns for col in required_columns):
            return jsonify({"error": "Missing required columns"}), 400

        # Process each row and create Vulnerability objects
        for _, row in df.iterrows():
            vulnerability = Vulnerability(
                name=row["Vulnerability Name"],
                risk_description=row["Risk Description"],
                severity=row["Severity"],
                affected_urls=row["Affected URLs"],
            )
            db.session.add(vulnerability)  # Add to database session

        # Commit all changes to database
        db.session.commit()

        # Return success response
        return jsonify(
            {
                "message": "Report processed successfully",
                "vulnerabilities_count": len(df),
            }
        ), 200

    except Exception as e:
        # Rollback database changes if any error occurs
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Create schema and tables on application startup
with app.app_context():
    create_schema()  # Create schema first
    db.create_all()  # Then create tables

# Run the application
if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode for development
