# FairDecide – AI Bias Detection & Fairness Analysis System

## 🔍 Overview
FairDecide is an interactive platform designed to demonstrate how bias emerges in AI-based decision systems, particularly in hiring scenarios. It provides a clear, step-by-step simulation of bias introduction, detection, and mitigation, focusing on **explainability and transparency** rather than complex model training.

The system helps users understand not just what bias is, but how it occurs and how it can be reduced.

---

## 🎯 Problem Statement
AI systems trained on historical data often inherit hidden biases, leading to unfair outcomes across different demographic groups.

However, most existing systems:
- Focus only on model accuracy  
- Lack transparency in decision-making  
- Do not clearly demonstrate how bias is introduced and mitigated  

---

## 📊 Fairness Metric Used

### Disparate Impact Ratio
- If Impact Ratio < **0.8** → Bias detected  
- Used for **post-decision fairness evaluation**

---

## 🧪 Dataset
- Synthetic dataset (CSV format)
- Fields include:
  - Name  
  - Gender  
  - Region  
  - Education  
  - Skills  
  - Experience  

👉 Designed with **borderline candidates** to clearly demonstrate bias impact

---

## 🚀 System Workflow
1. Upload or generate dataset  
2. Run system in **Standard Mode (Biased)**  
3. Observe selection imbalance  
4. Detect bias using fairness metrics  
5. Apply **Mitigation Mode**  
6. Compare results (**Before vs After**)  
7. Generate audit report  

---

## 🆚 How It Differs from Existing Solutions

| Feature | Existing Systems | FairDecide |
|--------|----------------|-----------|
| Focus | Model Accuracy | Explainability |
| Bias Visibility | Low | High |
| Learning Approach | ML-based | Simulation-based |
| Transparency | Limited | Strong |
| Accessibility | Technical | Beginner-friendly |

---

## 🌟 Unique Selling Points (USP)
- End-to-end bias lifecycle simulation (cause → detection → mitigation)  
- Transparent and explainable decision-making  
- Clear fairness improvement visualization  
- Interactive and intuitive UI  
- AI-powered explanation for better understanding  

---

## ⚠️ Limitations
- Does not use real ML model training  
- Uses synthetic dataset  
- Designed for demonstration and educational purposes  

---

## 🔮 Future Scope
- Integration with real ML models  
- Use of fairness libraries (Fairlearn, AIF360)  
- Real-world dataset integration  
- Continuous bias monitoring system  

---

## 📌 Conclusion
FairDecide emphasizes that fairness in AI is not automatic—it must be **measured, analyzed, and enforced**. The system makes bias visible, understandable, and correctable.

---

## 👩‍💻 Author
**Ayushi Karn**
**Apurva Jha**

---

## 📜 License
This project is for educational and demonstration purposes.
