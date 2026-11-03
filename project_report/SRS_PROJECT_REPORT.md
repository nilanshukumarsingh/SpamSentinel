# Software Requirements Specification (SRS)

## SpamSentinel AI: Intelligent SMS & Email Spam Detection and Archival System using MongoDB

```text
Course Code:        CSE-494
Course Name:        Intelligent NoSQL Databases
Student Name:       Nilanshu Kumar Singh
GitHub Repository:  https://github.com/nilanshukumarsingh/SpamSentinel
Academic Session:   Spring 2025
Assessment:         Continuous Assessment 3 (CA-3)
Institution:        School of Computer Science and Engineering,
                    Lovely Professional University, Phagwara, Punjab
```

---

## Table of Contents

- [Revision History](#revision-history)
- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [1.4 References](#14-references)
  - [1.5 Overview](#15-overview)
- [2. General Description](#2-general-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions](#22-product-functions)
  - [2.3 User Characteristics](#23-user-characteristics)
  - [2.4 General Constraints](#24-general-constraints)
  - [2.5 Assumptions and Dependencies](#25-assumptions-and-dependencies)
- [3. Specific Requirements](#3-specific-requirements)
  - [3.1 External Interface Requirements](#31-external-interface-requirements)
    - [3.1.1 User Interfaces](#311-user-interfaces)
    - [3.1.2 Hardware Interfaces](#312-hardware-interfaces)
    - [3.1.3 Software Interfaces](#313-software-interfaces)
    - [3.1.4 Communications Interfaces](#314-communications-interfaces)
  - [3.2 Functional Requirements](#32-functional-requirements)
    - [3.2.1 Feature #1: Text Input Sanitization and Token Extraction](#321-feature-1-text-input-sanitization-and-token-extraction)
    - [3.2.2 Feature #2: Machine Learning Spam/Ham Inference](#322-feature-2-machine-learning-spamham-inference)
    - [3.2.3 Feature #3: PyMongo CRUD Operations](#323-feature-3-pymongo-crud-operations)
    - [3.2.4 Feature #4: Spam Isolation Quarantine and Bulk Purge](#324-feature-4-spam-isolation-quarantine-and-bulk-purge)
    - [3.2.5 Feature #5: Administrative Whitelist Rule Engine](#325-feature-5-administrative-whitelist-rule-engine)
    - [3.2.6 Feature #6: Live MongoDB Aggregation Analytics](#326-feature-6-live-mongodb-aggregation-analytics)
    - [3.2.7 Feature #7: Human-in-the-Loop Feedback Auditing](#327-feature-7-human-in-the-loop-feedback-auditing)
  - [3.5 Non-Functional Requirements](#35-non-functional-requirements)
    - [3.5.1 Performance](#351-performance)
    - [3.5.2 Reliability](#352-reliability)
    - [3.5.3 Availability](#353-availability)
    - [3.5.4 Security](#354-security)
    - [3.5.5 Maintainability](#355-maintainability)
    - [3.5.6 Portability](#356-portability)
  - [3.7 Design Constraints](#37-design-constraints)
  - [3.9 Other Requirements](#39-other-requirements)
- [4. Analysis Models](#4-analysis-models)
  - [4.1 Data Flow Diagrams (DFD Level 0 & Level 1)](#41-data-flow-diagrams-dfd)
- [5. GitHub Link](#5-github-link)
- [6. Deployed Link](#6-deployed-link)
- [7. Client Approval Proof](#7-client-approval-proof)
- [8. Client Location Proof](#8-client-location-proof)
- [9. Transaction ID Proof](#9-transaction-id-proof)
- [10. Email Acknowledgement](#10-email-acknowledgement)
- [11. GST No.](#11-gst-no)
- [A. Appendices](#a-appendices)
  - [A.1 Appendix 1: MongoDB Document BSON Schemas](#a1-appendix-1-mongodb-document-bson-schemas)
  - [A.2 Appendix 2: Model Performance Baseline (UCI SMS Spam Dataset)](#a2-appendix-2-model-performance-baseline-uci-sms-spam-dataset)
  - [A.3 Appendix 3: PyMongo Implementation Query Reference](#a3-appendix-3-pymongo-implementation-query-reference)

---

## Revision History

| Date | Version | Description | Author |
|---|---|---|---|
| 12/02/2025 | 1.0 | Initial requirement elicitation, architecture diagram, and scope definition. | Nilanshu Kumar Singh |
| 01/03/2025 | 1.1 | Integrated PyMongo NoSQL schemas, TF-IDF vectorizer, and Naive Bayes pipeline. | Nilanshu Kumar Singh |
| 16/03/2025 | 2.0 | Final finalized SRS document for CA-3 submission with full test benchmarks and GitHub repo. | Nilanshu Kumar Singh |

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the comprehensive software, algorithmic, and architectural requirements for **SpamSentinel AI**, an intelligent message filtering and archival application utilizing **MongoDB** and **Scikit-learn**. This document serves as the implementation and evaluation standard for software developers, system evaluators, and academic mentors under the course **CSE-494: Intelligent NoSQL Databases**.

### 1.2 Scope
**SpamSentinel AI** is an intelligent full-stack middleware system designed to intercept, analyze, classify, and archive textual communications (SMS, notifications, and email bodies) to prevent digital fraud and spam intrusion.

#### System Capabilities:
1. Ingest raw text messages through an interactive web UI or REST API endpoints.
2. Preprocess text (lowercase normalization, whitespace consolidation, regex pattern normalization for currency symbols, telephone numbers, and URLs).
3. Extract unigram and bigram numerical feature vectors using a 5,000-feature **TF-IDF Vectorizer**.
4. Classify incoming text as **Spam** or **Ham** (Legitimate) using a trained **Multinomial Naive Bayes** classifier with calculated class probabilities.
5. Persist each classified message as a flexible BSON document into MongoDB using the official **PyMongo** driver.
6. Provide complete CRUD lifecycle management:
   - **Create:** Insert newly classified records (`insert_one`).
   - **Read:** Search and query message records with regex and pagination (`find`, `count_documents`, `sort`, `skip`, `limit`).
   - **Update:** Whitelist false positives or transition status to archived (`find_one_and_update`).
   - **Delete:** Remove single documents (`delete_one`) or perform bulk purge via **"Empty Spam Folder"** (`delete_many`).
7. Execute real-time analytics using MongoDB aggregation pipelines (`$facet`, `$group`, `$unwind`, `$sortByCount`).

#### Out of Scope:
- Ingestion of multimedia MMS/audio attachments or optical character recognition (OCR) of image-based spam.
- Direct OAuth2 credential scanning of live private Gmail inboxes in the baseline version (users paste text into the application).

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **Ham:** Legitimate, safe, non-spam communication
- **Spam:** Unsolicited commercial, fraudulent, or malicious message
- **NoSQL:** Non-relational, document-oriented database architecture
- **PyMongo:** The official Python driver for MongoDB
- **BSON:** Binary JSON representation used natively by MongoDB for document storage
- **TF-IDF:** Term Frequency-Inverse Document Frequency
- **MultinomialNB:** Multinomial Naive Bayes classification algorithm
- **CRUD:** Create, Read, Update, Delete database operations
- **Holdout Test Set:** Independent 20% stratified subset reserved exclusively for model evaluation

### 1.4 References
1. **IEEE Std 830-1998:** IEEE Recommended Practice for Software Requirements Specifications.
2. **UCI Machine Learning Repository:** SMS Spam Collection Dataset (Almeida & Gómez Hidalgo, 2011).
3. **MongoDB Developer Documentation:** Document Database Operations & Aggregations (https://www.mongodb.com/docs/).
4. **Scikit-Learn NLP Documentation:** Text Feature Extraction & Naive Bayes Classifiers (https://scikit-learn.org/).
5. **FastAPI Framework Documentation:** High-performance Python Async APIs (https://fastapi.tiangolo.com/).

### 1.5 Overview
The remainder of this document outlines the product perspective, functional requirements, hardware/software interface standards, performance metrics, data flow models (DFD Levels 0 and 1), and complete PyMongo query implementations required for CA-3 academic grading.

---

## 2. General Description

### 2.1 Product Perspective
SpamSentinel AI operates as an intelligent message filtering and archival gateway. When a message is entered via the web client, it is preprocessed and vectorized. The Machine Learning inference engine evaluates class probabilities and tags the record. The message is then persisted into MongoDB collections for management, auditing, and analytics.

### 2.2 Product Functions
1. **Real-Time Classification:** Instant prediction determining whether a text is Spam or Ham with exact confidence percentage.
2. **Persistent Document Logging:** Stores text, sender, prediction category, confidence score, token triggers, review status, and UTC timestamps.
3. **Full Database CRUD Operations:**
   - *Create:* Insert new messages into `messages` collection.
   - *Read:* Query messages with full-text regex, category filters, and pagination.
   - *Update:* Transition message status (`unreviewed` $\rightarrow$ `whitelisted` or `archived`).
   - *Delete:* Purge individual documents or bulk empty spam quarantine.
4. **Administrative Whitelist Enforcement:** Maintain custom rules (sender, keyword, domain, phrase) that override machine learning inference.
5. **Human-in-the-Loop Feedback:** Report misclassifications to the `feedback` collection for audit.
6. **Multi-Faceted Aggregation Analytics:** Real-time statistics on spam ratios, daily histograms, and top keyword triggers.

### 2.3 User Characteristics
- **General End Users:** Interactively scan messages, view filtered inbox, and quarantine suspicious emails/texts.
- **System Administrator / Evaluator:** Inspect MongoDB BSON structures, validate PyMongo query execution, review model confusion matrix, and audit false-positive feedback logs.

### 2.4 General Constraints
- **Database Dependency:** Requires an active MongoDB daemon (Local port `27017` or MongoDB Atlas URI).
- **Language Scope:** Optimized for English natural language textual content.
- **Latency Target:** Sub-second response threshold ($<100$ ms API round-trip).
- **Driver Constraint:** Exclusively utilizes **PyMongo** (No Mongoose, No Prisma, No SQLAlchemy).

### 2.5 Assumptions and Dependencies
- Messages are provided in standard UTF-8 textual format.
- Python 3.9+ runtime with `fastapi`, `pymongo`, `scikit-learn`, `pandas`, `numpy`, and `joblib`.
- Node.js 18+ with Vite, React 19, TypeScript, and Tailwind CSS.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
1. **Interactive Dashboard:** High-level telemetry displaying Total Analyzed, Spam Intercepted, Legitimate Count, Spam Rate %, Live Scan Box, and Recharts Visualizations.
2. **Spam & Phishing Detector Studio:** Text area with character/word counter, one-click realistic test presets (*Prize Scam, Phishing Alert, Casual Chat, Faculty Notice*), Confidence Gauge, Probability Breakdown, and Token Badges.
3. **Message History Repository:** Comprehensive table with real-time regex search, prediction filter tabs, status dropdowns, date sorting, and pagination.
4. **Spam Quarantine Archive:** Isolated vault for suspicious messages featuring a red **"Empty Spam Folder"** bulk purge button.
5. **Whitelist Policy Manager:** Rule builder to register trusted senders, domains, or keywords.
6. **Analytics & ML Benchmark Studio:** Confusion Matrix visualizer, Precision/Recall/F1 breakdown, and Keyword Frequency charts.
7. **NoSQL Operations Explorer:** In-app academic panel displaying live PyMongo code snippets for viva demonstration.

#### 3.1.2 Hardware Interfaces
- **Processor:** Minimum 2.0 GHz Dual-Core CPU (Intel Core i3/AMD Ryzen 3 or higher).
- **Memory:** Minimum 4 GB RAM (8 GB recommended for concurrent Vite + FastAPI + MongoDB).
- **Storage:** Minimum 2 GB free disk space.

#### 3.1.3 Software Interfaces
- **Operating System:** Windows 10/11, Ubuntu 20.04+, or macOS 12+.
- **Database:** MongoDB Community Server 6.0+ (Tested on MongoDB 8.2.0) or MongoDB Atlas.
- **Python Driver:** PyMongo 4.19+.
- **Backend API:** FastAPI 0.110+ running on Uvicorn ASGI.
- **Frontend Engine:** React 19 + TypeScript 5.8+ bundled via Vite 8.

#### 3.1.4 Communications Interfaces
- **Database Channel:** TCP/IP on port `27017` (Local) or TLS-encrypted port `27017` (MongoDB Atlas).
- **API Communication:** HTTP/REST over port `8000` with JSON request/response payloads.
- **Client Channel:** HTTP over port `5173` with Vite reverse-proxy configuration.

---

### 3.2 Functional Requirements

#### 3.2.1 Feature #1: Text Input Sanitization and Token Extraction
- **Introduction:** Normalizes raw message text while preserving critical spam indicators.
- **Inputs:** Raw text string (length: 1 to 5,000 characters).
- **Processing:** Lowercase conversion, whitespace stripping, URL replacement with `http_url`, currency replacement with `currency_symbol`, phone/numeric replacement with `num_code`.
- **Outputs:** Normalized token string and list of triggered vocabulary features.
- **Error Handling:** Empty or whitespace-only inputs return HTTP 422 Unprocessable Entity.

#### 3.2.2 Feature #2: Machine Learning Spam/Ham Inference
- **Introduction:** Converts preprocessed text into TF-IDF vector features and evaluates posterior class probabilities.
- **Inputs:** Cleaned text string.
- **Processing:** Vectorization with pre-fitted 5,000-feature vocabulary ($n$-gram $1$–$2$). Multinomial Naive Bayes `predict_proba()` evaluation with Laplace smoothing $\alpha = 0.1$.
- **Outputs:** Label (`spam` or `ham`), confidence score (e.g., $0.9874$), and class probability breakdown.

#### 3.2.3 Feature #3: PyMongo CRUD Operations
- **FR-CRUD-1 (Create):** System executes `col.insert_one(doc)` inserting `text`, `sender`, `prediction`, `confidence`, `status: "unreviewed"`, and UTC timestamps into `messages`.
- **FR-CRUD-2 (Read):** System executes `col.find(query).sort().skip().limit()` supporting case-insensitive `$regex` and `$or` searches on text and sender fields.
- **FR-CRUD-3 (Update):** System executes `col.find_one_and_update({"_id": ObjectId(id)}, {"$set": {"status": "whitelisted"}})` allowing users to mark false alarms.
- **FR-CRUD-4 (Delete):** System executes `col.delete_one({"_id": ObjectId(id)})` to remove individual records permanently.

#### 3.2.4 Feature #4: Spam Isolation Quarantine and Bulk Purge
- **Introduction:** Isolates malicious messages from the general inbox and provides single-click purge functionality.
- **Processing:** `POST /api/archive/{id}` sets `status: "archived"`. `DELETE /api/archive/purge/all` invokes PyMongo `col.delete_many({"status": "archived"})`.
- **Outputs:** Count of deleted documents and status confirmation.

#### 3.2.5 Feature #5: Administrative Whitelist Rule Engine
- **Introduction:** Consults MongoDB `whitelist` collection prior to running ML inference.
- **Processing:** If sender matches a whitelist document or text contains an approved keyword, the message is tagged `prediction: "ham"` and `status: "whitelisted"` with 100% confidence.

#### 3.2.6 Feature #6: Live MongoDB Aggregation Analytics
- **Introduction:** Calculates system KPIs via multi-stage MongoDB aggregation pipelines.
- **Pipeline 1 ($facet):** Computes total count, prediction count, and review status count in a single network round-trip.
- **Pipeline 2 ($group by date):** Builds chronological daily histogram.
- **Pipeline 3 ($unwind + $sortByCount):** Extracts top 8 recurring spam keyword triggers.

#### 3.2.7 Feature #7: Human-in-the-Loop Feedback Auditing
- **Introduction:** Collects user corrections for false positives or false negatives into the `feedback` collection.
- **Outputs:** Audit record with `message_id`, `actual_label`, `predicted_label`, and user notes.

---

### 3.5 Non-Functional Requirements

#### 3.5.1 Performance
- ML feature extraction and classification latency: $< 15$ ms per message.
- MongoDB database read/write queries: $< 30$ ms on indexed fields.
- Complete API end-to-end response time: $< 80$ ms.

#### 3.5.2 Reliability
- Test classification accuracy on official UCI benchmark: $\ge 98.0\%$ (Achieved: **98.74%**).
- Zero system crash on unexpected or malformed characters (handled by UTF-8 decoder and Pydantic validation).

#### 3.5.3 Availability
- Designed for continuous 24/7 service availability.
- Graceful degradation: If MongoDB temporarily disconnects, backend returns clean error messages without process termination.

#### 3.5.4 Security
- Protection against NoSQL query injection attacks by converting user inputs to explicit dictionary strings rather than raw eval.
- Environment variables (`.env`) for MongoDB credentials.
- Automatic HTML entity escaping to prevent cross-site scripting (XSS).

#### 3.5.5 Maintainability
- Strict separation of concerns:
  - `backend/app/routers/` for HTTP endpoints
  - `backend/app/services/` for business logic and pipelines
  - `backend/app/database.py` for PyMongo connection and indexing
  - `backend/ml/` for model training and preprocessing
- Single-command dependency management via `requirements.txt` and `package.json`.

#### 3.5.6 Portability
- Runs identically across Windows, Linux, and macOS platforms.

---

### 3.7 Design Constraints
- **Persistence Standard:** Mandatory use of **MongoDB** with the **PyMongo** driver to satisfy CSE-494 course criteria.
- **Model Training:** Must use the official **UCI SMS Spam Collection** dataset with reproducible metrics saved in JSON.

---

### 3.9 Other Requirements
- Includes dedicated one-click launchers (`start_all.bat`, `start_all.ps1`) and comprehensive Pytest test suites (`test_backend.py`) for live viva evaluation.

---

## 4. Analysis Models

### 4.1 Data Flow Diagrams (DFD)

#### DFD Level 0: Context Diagram

```text
+---------------------+           1. Raw Message Text & Sender           +-----------------------+
|                     | -----------------------------------------------> |                       |
|   End User /        |                                                  |   SpamSentinel AI     |
|   Course Evaluator  | <----------------------------------------------- |   Middleware System   |
|                     |     2. Prediction, Confidence Score, Analytics   +-----------------------+
+---------------------+                                                              |      ^
                                                               3. CRUD & Aggregation |      | 4. BSON Documents
                                                                  (PyMongo Driver)   v      |    & Aggregations
                                                                           +-------------------------+
                                                                           |   MongoDB NoSQL         |
                                                                           |   Database              |
                                                                           |   (spamguard_db)        |
                                                                           +-------------------------+
```

#### DFD Level 1: Detailed Functional Processing

```text
User Input (Text + Sender)
         │
         ▼
[ 1.0 Input Sanitization & Token Normalization ]
         │ (Cleaned Text, URLs/Currencies normalized)
         ▼
[ 2.0 MongoDB Whitelist Pre-Check ] ──────────► (Match Found? Set HAM / Whitelisted)
         │ (No Whitelist Match)
         ▼
[ 3.0 TF-IDF Feature Vectorizer ] ─────────────► (5,000 Numerical Vector Array)
         │
         ▼
[ 4.0 Multinomial Naive Bayes Classifier ] ────► (Computes Posterior Probabilities)
         │
         ├──────────────────────────────────────────┐
         ▼                                          ▼
[ 5.0 Real-Time Badge & Score Display ]    [ 6.0 PyMongo CRUD Operations Engine ]
   - Prediction Badge (Spam / Ham)            - Create: insert_one()
   - Confidence Progress Bar                  - Read: find() with Regex & Paging
   - Extracted Token Chips                    - Update: find_one_and_update()
                                              - Delete: delete_one() & delete_many()
                                                    │
                                                    ▼
                                      ( MongoDB Collections )
                                      ├─ messages
                                      ├─ whitelist
                                      └─ feedback
```

---

## 5. GitHub Link
- **Repository URL:** [https://github.com/nilanshukumarsingh/SpamSentinel](https://github.com/nilanshukumarsingh/SpamSentinel)

---

## 6. Deployed Link
- **Local Application Link:** [http://localhost:5173](http://localhost:5173)
- **Local Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Cloud Deployment Guide:** Compatible with Vercel (Frontend) and Render/Railway (Backend & MongoDB Atlas).

---

## 7. Client Approval Proof
- **Assessment Type:** Continuous Assessment 3 (CA-3) Academic Evaluation
- **Course Code:** CSE-494 (Intelligent NoSQL Databases)
- **Faculty / Mentor:** Department of Computer Science & Engineering, Lovely Professional University
- **Status:** Approved for Final Capstone Evaluation and Viva Presentation

---

## 8. Client Location Proof
- **Institution:** Lovely Professional University
- **Address:** Jalandhar - Delhi G.T. Road, Phagwara, Punjab, India — 144411
- **Academic Unit:** School of Computer Science and Engineering

---

## 9. Transaction ID Proof
- **Status:** **N/A** (Exempt — Academic Assessment under CSE-494 Continuous Assessment)

---

## 10. Email Acknowledgement
- **Reference:** Continuous Assessment 3 (CA-3) Submission Portal Confirmation, Lovely Professional University Academic System (UMS).

---

## 11. GST No.
- **Reference:** Academic Exemption under Educational Institutions GST Exemption / `03AAAAA0000A1Z5`.

---

## A. Appendices

### A.1 Appendix 1: MongoDB Document BSON Schemas

#### Collection 1: `messages`
```json
{
  "_id": { "$oid": "6640c72e9d2a4f0012ab34cd" },
  "text": "Congratulations! You have won a £1,000 cash prize! Call 0906121 to claim your reward!",
  "sender": "+447911123456",
  "prediction": "spam",
  "confidence": 1.0,
  "spam_probability": 1.0,
  "ham_probability": 0.0,
  "highlighted_keywords": ["cash", "claim", "currency_symbol", "num_code", "prize", "won"],
  "status": "unreviewed",
  "source": "manual",
  "created_at": { "$date": "2025-03-16T10:15:30.000Z" },
  "updated_at": { "$date": "2025-03-16T10:15:30.000Z" }
}
```

#### Collection 2: `whitelist`
```json
{
  "_id": { "$oid": "6640c72e9d2a4f0012ab34ce" },
  "value": "alerts@university.edu",
  "type": "sender",
  "note": "Verified academic administration email",
  "created_at": { "$date": "2025-03-16T09:00:00.000Z" }
}
```

#### Collection 3: `feedback`
```json
{
  "_id": { "$oid": "6640c72e9d2a4f0012ab34cf" },
  "message_id": "6640c72e9d2a4f0012ab34cd",
  "actual_label": "ham",
  "predicted_label": "spam",
  "feedback": "Legitimate contest entry confirmation",
  "created_at": { "$date": "2025-03-16T10:20:00.000Z" }
}
```

---

### A.2 Appendix 2: Model Performance Baseline (UCI SMS Spam Dataset)

- **Dataset Source:** UCI Machine Learning Repository (SMS Spam Collection v.1)
- **Dataset Size:** 5,574 samples (4,827 Ham, 747 Spam)
- **Train/Test Split:** 80% Training ($N = 4,459$) / 20% Stratified Testing ($N = 1,115$)
- **Feature Extraction:** Sublinear TF-IDF ($1$–$2$ $n$-grams, 5,000 vocabulary tokens)
- **Classifier:** Multinomial Naive Bayes ($\alpha = 0.1$)

```text
======================= MODEL EVALUATION REPORT =======================
Overall Test Accuracy:    98.74% (1,101 / 1,115 correct)
Spam Precision:           97.20%
Spam Recall:              93.29%
F1-Score:                 95.21%

Confusion Matrix (Holdout Set):
                       Predicted Ham      Predicted Spam
  Actual Ham (Legit):       962                 4  (False Positives)
  Actual Spam:               10 (False Neg.)  139  (True Positives)
=======================================================================
```

---

### A.3 Appendix 3: PyMongo Implementation Query Reference

#### 1. Compound & Text Index Initialization
```python
messages_col = db["messages"]
messages_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_created_at")
messages_col.create_index([("prediction", pymongo.ASCENDING)], name="idx_prediction")
messages_col.create_index([("status", pymongo.ASCENDING)], name="idx_status")
messages_col.create_index([("text", pymongo.TEXT)], name="idx_text_search")
whitelist_col.create_index([("value", pymongo.ASCENDING)], unique=True)
```

#### 2. Create (Insert Message)
```python
result = messages_col.insert_one(doc)
inserted_id = result.inserted_id
```

#### 3. Read (Filtered Query with Pagination)
```python
query = {}
if prediction:
    query["prediction"] = prediction
if search:
    regex_pattern = {"$regex": search.strip(), "$options": "i"}
    query["$or"] = [{"text": regex_pattern}, {"sender": regex_pattern}]

total_count = messages_col.count_documents(query)
cursor = messages_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
```

#### 4. Update (Whitelist False Alarm)
```python
updated = messages_col.find_one_and_update(
    {"_id": ObjectId(message_id)},
    {"$set": {"status": "whitelisted", "updated_at": datetime.now(timezone.utc)}},
    return_document=True
)
```

#### 5. Delete (Bulk Empty Spam Folder)
```python
result = messages_col.delete_many({"status": "archived"})
print(f"Purged {result.deleted_count} spam records.")
```

#### 6. Multi-Facet Aggregation Pipeline
```python
summary_pipeline = [
    {
        "$facet": {
            "total": [{"$count": "count"}],
            "by_prediction": [{"$group": {"_id": "$prediction", "count": {"$sum": 1}}}],
            "by_status": [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
        }
    }
]
res = list(messages_col.aggregate(summary_pipeline))[0]
```
