import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    """Set cell padding in dxa (1 pt = 20 dxa)"""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="B0C4DE", sz="6", val="single"):
    """Set subtle, professional borders for academic tables"""
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_heading_with_spacing(doc, text, level=1, space_before=14, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.bold = True
    if level == 1:
        run.font.size = Pt(14)
        run.font.color.rgb = RGBColor(0, 0, 0)
    elif level == 2:
        run.font.size = Pt(13)
        run.font.color.rgb = RGBColor(0, 0, 0)
    else:
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_body_paragraph(doc, text, space_after=6, line_spacing=1.15):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(20, 20, 20)
    return p

def add_bullet_item(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run_b = p.add_run(bold_prefix)
    run_b.font.name = 'Times New Roman'
    run_b.font.size = Pt(12)
    run_b.bold = True
    
    run_t = p.add_run(text)
    run_t.font.name = 'Times New Roman'
    run_t.font.size = Pt(12)
    run_t.font.color.rgb = RGBColor(20, 20, 20)
    return p

def main():
    doc = Document()
    
    # Page Margins (1 inch all sides)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # ==========================================
    # PAGE 1: COVER PAGE (LPU SYNOPSIS FORMAT)
    # ==========================================
    p_univ = doc.add_paragraph()
    p_univ.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_univ.paragraph_format.space_before = Pt(0)
    p_univ.paragraph_format.space_after = Pt(4)
    r_univ = p_univ.add_run("Lovely Professional University")
    r_univ.font.name = 'Times New Roman'
    r_univ.font.size = Pt(20)
    r_univ.bold = True

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_after = Pt(2)
    r_dept = p_dept.add_run("School of Computer Science and Engineering")
    r_dept.font.name = 'Times New Roman'
    r_dept.font.size = Pt(12)

    p_campus = doc.add_paragraph()
    p_campus.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_campus.paragraph_format.space_after = Pt(36)
    r_campus = p_campus.add_run("UpGrad Campus, Phagwara, Punjab – India")
    r_campus.font.name = 'Times New Roman'
    r_campus.font.size = Pt(12)

    p_syn = doc.add_paragraph()
    p_syn.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_syn.paragraph_format.space_after = Pt(4)
    r_syn = p_syn.add_run("SYNOPSIS")
    r_syn.font.name = 'Times New Roman'
    r_syn.font.size = Pt(22)
    r_syn.bold = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(35)
    r_sub = p_sub.add_run("for the B.Tech Final Year Project")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(12)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("EVision: EV Charging Demand Forecasting and Infrastructure Gap Analysis System")
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(16)
    r_title.bold = True

    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_after = Pt(50)
    r_subtitle = p_subtitle.add_run("(A Multi-Factor Spatial-Temporal Analysis of EV Adoption, Charging Station Deficits, Demand Forecasting, and Location Optimization using Exploratory Data Analysis, Machine Learning, Tableau BI, and Web Technologies)")
    r_subtitle.font.name = 'Times New Roman'
    r_subtitle.font.size = Pt(11)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_after = Pt(4)
    r_meta_lbl = p_meta.add_run("Submitted by:\n")
    r_meta_lbl.bold = True
    r_meta_lbl.font.size = Pt(12)
    
    r_meta_val = p_meta.add_run("[Student Name 1], [Student Name 2], [Student Name 3]\n")
    r_meta_val.font.size = Pt(12)
    
    r_roll = p_meta.add_run("Roll Nos.: [Roll No 1], [Roll No 2], [Roll No 3]\n\n")
    r_roll.bold = True
    r_roll.font.size = Pt(12)

    r_course = p_meta.add_run("Course Code: CSE461\n")
    r_course.bold = True
    r_course.font.size = Pt(12)

    r_session = p_meta.add_run("Session: Jan 2026 – May 2026")
    r_session.bold = True
    r_session.font.size = Pt(12)

    doc.add_page_break()

    # ==========================================
    # PAGE 2: EXHAUSTIVE INTRODUCTION
    # ==========================================
    add_heading_with_spacing(doc, "Introduction:", level=1, space_before=0, space_after=12)
    
    add_heading_with_spacing(doc, "Background/Context:", level=2, space_before=6, space_after=6)
    add_body_paragraph(
        doc,
        "The electrification of road transport in India represents one of the most critical transitions in sustainable mobility and environmental governance. Driven by central and state policy frameworks—such as the Ministry of Heavy Industries' PM E-DRIVE scheme, FAME-II incentives, and state-level EV tax waivers—electric vehicle (EV) adoption has expanded rapidly. Official vehicle registration analytics from the Ministry of Road Transport and Highways (VAHAN) demonstrate accelerating adoption across two-wheelers (2W), three-wheelers (3W), passenger four-wheelers (4W), and public transit bus fleets. However, electric mobility relies on a robust, spatially distributed public charging infrastructure network to alleviate consumer range anxiety and maintain fleet operational continuity."
    )
    add_body_paragraph(
        doc,
        "Presently, public charging infrastructure expansion in India struggles to keep pace with localized vehicle adoption rates. Bureau of Energy Efficiency (BEE) data indicates substantial state-level and district-level disparities in charging station deployment. While states such as Karnataka lead in absolute public charging station counts (~6,100 stations), states such as Uttar Pradesh lead national EV registration volumes (~18% of national sales) with comparatively fewer public charging facilities. This structural mismatch creates localized charging deserts, extreme station queueing during peak hours, and uncoordinated electrical grid loads. Managing this infrastructure transition requires data-driven decision-support frameworks."
    )

    add_heading_with_spacing(doc, "Problem Statement:", level=2, space_before=10, space_after=6)
    add_body_paragraph(
        doc,
        "Municipal planners, private Charging Point Operators (CPOs), and government agencies face a complex spatial allocation challenge: determining where infrastructure gaps currently exist and where future charging demand will exceed grid capacity. Existing infrastructure planning relies primarily on reactive deployments or static geographic heuristics, failing to account for dynamic multi-variable interactions—such as vehicle growth velocity, charger-to-EV ratio pressure, urban population density, and demographic economic tiers. Furthermore, traditional static reports lack predictive machine learning models to forecast 2026–2030 demand and lack interactive visualization dashboards (Tableau / Web portals) to support strategic capital allocation."
    )

    add_heading_with_spacing(doc, "Rationale/Justification:", level=2, space_before=10, space_after=6)
    add_body_paragraph(
        doc,
        "To resolve these challenges, this project introduces 'EVision', an enterprise-grade data science and machine learning decision-support platform tailored specifically to the Indian EV landscape. EVision unifies longitudinal registration data, public charging station statistics, and demographic datasets across 32 Indian States/UTs and key urban districts. By engineering a mathematical Infrastructure Gap Index (0–100), training machine learning forecasting algorithms (Log-Linear trends, Random Forest Regressors, and Random Forest Fraud Security Classifiers), creating interactive Tableau BI dashboards, and developing a feature-rich web application (including battery calculators, EV resale pricing ML models, and doorstep charging payment gateways), this project provides a comprehensive, end-to-end analytical framework."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 3: DETAILED OBJECTIVES
    # ==========================================
    add_heading_with_spacing(doc, "Objectives:", level=1, space_before=0, space_after=12)
    
    add_heading_with_spacing(doc, "General Objective:", level=2, space_before=6, space_after=6)
    add_body_paragraph(
        doc,
        "To design, implement, and validate a comprehensive data science decision-support system ('EVision') that analyzes Indian EV adoption metrics, quantifies spatial infrastructure gaps, forecasts 2026–2030 charging demand using Machine Learning, and delivers interactive visual analytics via Tableau BI and a Python Streamlit web portal."
    )

    add_heading_with_spacing(doc, "Specific Objectives:", level=2, space_before=10, space_after=8)
    
    add_bullet_item(doc, "1. Multi-Source Data Synthesis & Preprocessing: ", "To collect, clean, and integrate longitudinal Indian datasets (2020–2025) from VAHAN registration analytics, Bureau of Energy Efficiency (BEE) public station statistics, and Census population projections across 32 States/UTs and major urban districts into a unified master database (`master_ev_dataset.csv`).")
    add_bullet_item(doc, "2. Exploratory Data Analysis & Growth Mismatch Detection: ", "To conduct rigorous bivariate and multivariate exploratory data analysis (EDA), identifying regional growth mismatches where vehicle registration growth outpaces charging infrastructure installation rates.")
    add_bullet_item(doc, "3. Mathematical Infrastructure Gap Indexing: ", "To formulate and compute a normalized multi-criteria Infrastructure Gap Score (0–100) incorporating charger deficits, EV-to-charger pressure ratios, vehicle adoption velocity, and urban density metrics, categorizing regions into Low, Moderate, High, and Critical gap tiers.")
    add_bullet_item(doc, "4. Predictive Machine Learning Modeling: ", "To fit state-level log-linear extrapolation models for EV demand, train a Random Forest Regressor to predict required public charging stations by 2030 ($R^2 = 0.385$), and construct a Random Forest Classifier pipeline (94% accuracy) to evaluate payment fraud security for charging slot reservations.")
    add_bullet_item(doc, "5. Tableau Business Intelligence Integration: ", "To design and export interactive Tableau dashboard workbooks (`.csv` / `.hyper` schemas) displaying geospatial bubble maps, multi-factor correlation matrices, and regional demand projections for policy stakeholders.")
    add_bullet_item(doc, "6. Interactive Web Portal & Consumer E-Mobility Suite: ", "To build a user-facing Python Streamlit application featuring policy deployment weight planners, battery charging duration/cost calculators, a new/used EV marketplace with ML resale price estimation, and doorstep pickup service booking.")

    doc.add_page_break()

    # ==========================================
    # PAGE 4: SCOPE OF THE PROJECT
    # ==========================================
    add_heading_with_spacing(doc, "Scope of the Project:", level=1, space_before=0, space_after=12)
    
    add_heading_with_spacing(doc, "Included:", level=2, space_before=6, space_after=8)
    add_bullet_item(doc, "• Geographic & Temporal Granularity: ", "Longitudinal analysis spanning 2020–2025 across 32 Indian States and Union Territories, alongside granular district/city level analytics for major metropolitan hubs (Mumbai, Pune, Noida, Lucknow, Bengaluru Urban, South Delhi, Chennai, Hyderabad, etc.).")
    add_bullet_item(doc, "• Machine Learning & Predictive Modeling: ", "Application of log-linear state trend extrapolations and Random Forest Regressors for 2026–2030 EV adoption and station requirement forecasting; implementation of a Random Forest Classifier for UPI transaction security.")
    add_bullet_item(doc, "• Decision Support & Deployment Optimization: ", "Development of a multi-criteria priority deployment planner allowing users to customize weights for EV density, growth velocity, and charger capacity shortages.")
    add_bullet_item(doc, "• Business Intelligence & Web Analytics: ", "Creation of exportable Tableau BI datasets and a fully interactive Streamlit web dashboard featuring custom CSS themes, visual cards, and Pydeck map layers.")
    add_bullet_item(doc, "• Consumer E-Mobility Services: ", "Integration of battery charging time/cost calculators, carbon offset estimators, an EV Buy & Sell marketplace with an ML resale pricing engine, and doorstep pickup concierge booking.")

    add_heading_with_spacing(doc, "Excluded:", level=2, space_before=14, space_after=8)
    add_bullet_item(doc, "• Real-Time Physical IoT Telemetry: ", "Direct hardware sensor integration on physical charging plugs (data is processed from official government database snapshots).")
    add_bullet_item(doc, "• Live Banking Gateway Clearing: ", "Real-world financial clearing through live banking APIs (a simulated UPI payment flow verified by the trained ML security classifier is implemented).")
    add_bullet_item(doc, "• International / Global Markets: ", "Analysis is strictly focused on the Indian EV market ecosystem and government policy frameworks.")

    doc.add_page_break()

    # ==========================================
    # PAGE 5: LITERATURE REVIEW (BRIEF)
    # ==========================================
    add_heading_with_spacing(doc, "Literature Review (brief):", level=1, space_before=0, space_after=12)
    
    add_bullet_item(doc, "• Markowitz & Spatial Location Optimization (1952, 2013): ", "Foundational research in spatial allocation theory (Xi et al., 2013) demonstrates that public infrastructure deployment must be optimized based on spatial demand density rather than uniform geographic distribution to minimize user travel time and maximize charger utilization.")
    add_bullet_item(doc, "• Government Policy Frameworks (PM E-DRIVE & BEE 2024): ", "Official guidelines published by the Ministry of Heavy Industries and Bureau of Energy Efficiency emphasize the need for interoperable public charging networks and highlight state-level disparities in charger installation velocity, underscoring the necessity of dynamic decision-support tools.")
    add_bullet_item(doc, "• Machine Learning in Technology Forecasting (Zhang & Li, 2020): ", "Studies in applied data science demonstrate that ensemble machine learning models (such as Random Forests and Log-Linear Regressions) outperform traditional linear models when modeling non-linear technology adoption curves and spatial charging demands.")
    add_bullet_item(doc, "• Business Intelligence & Visual Analytics (Few, 2006): ", "Research in visual analytics shows that integrating interactive BI tools (e.g., Tableau, Pydeck maps) enhances policy decision-making by enabling multi-dimensional spatial exploration and scenario planning.")
    add_bullet_item(doc, "• Indian E-Mobility Research Gap: ", "Existing academic literature focuses primarily on vehicle battery chemistry or single-city traffic simulations. Very few studies provide an end-to-end framework combining national registration data, charger growth mismatches, ML forecasting, Tableau BI, and consumer service portals.")

    doc.add_page_break()

    # ==========================================
    # PAGE 6: METHODOLOGY
    # ==========================================
    add_heading_with_spacing(doc, "Methodology:", level=1, space_before=0, space_after=12)
    
    add_heading_with_spacing(doc, "Research Design:", level=2, space_before=4, space_after=6)
    add_body_paragraph(
        doc,
        "A quantitative, empirical, and experimental data science research design following the industry-standard CRISP-DM (Cross-Industry Standard Process for Data Mining) methodology across six phases: Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, and Deployment."
    )

    add_heading_with_spacing(doc, "Data Collection Methods:", level=2, space_before=10, space_after=6)
    add_bullet_item(doc, "• Vehicle Registrations: ", "Longitudinal EV registration analytics (2W, 3W, 4W, Buses) extracted from Ministry of Road Transport and Highways (VAHAN) analytics dashboards (2020–2025).")
    add_bullet_item(doc, "• Public Infrastructure Data: ", "State/UT-wise public charging station records published by the Bureau of Energy Efficiency (BEE) and Open Government Data (OGD) platforms.")
    add_bullet_item(doc, "• Demographic & Spatial Metrics: ", "Census population projections, land area (sq km), urbanization rates, and economic GDP tiers for 32 Indian States/UTs.")

    add_heading_with_spacing(doc, "Data Analysis & ML Techniques:", level=2, space_before=10, space_after=6)
    add_bullet_item(doc, "• Feature Engineering & Gap Formula: ", "Calculation of EV-to-Charger Ratios, YoY growth percentages, and a multi-criteria Infrastructure Gap Score: Raw Gap Score = 0.30 × Deficit + 0.30 × Ratio Pressure + 0.20 × Growth Velocity + 0.20 × Urbanization.")
    add_bullet_item(doc, "• Predictive Modeling: ", "State-wise Log-Linear trends for EV growth extrapolation to 2030, Random Forest Regression for charging station demand prediction, and a Random Forest Classifier pipeline for UPI transaction security evaluation.")
    add_bullet_item(doc, "• Evaluation Metrics: ", "R-squared ($R^2$), Mean Squared Error (MSE), Precision, Recall, F1-Score, and Classification Accuracy.")

    add_heading_with_spacing(doc, "Tools and Technologies:", level=2, space_before=10, space_after=6)
    add_bullet_item(doc, "• Languages & Libraries: ", "Python 3.10+, Pandas, NumPy, Scikit-Learn, Joblib, OpenPyXL.")
    add_bullet_item(doc, "• Visual Analytics & BI: ", "Tableau Desktop / Tableau Public, Plotly Express, Pydeck Spatial Maps, Seaborn, Matplotlib.")
    add_bullet_item(doc, "• Web Portal Framework: ", "Streamlit, Custom CSS Themes (Glassmorphism, Dark Mode).")

    doc.add_page_break()

    # ==========================================
    # PAGE 7: EXPECTED OUTCOMES & TIMELINE
    # ==========================================
    add_heading_with_spacing(doc, "Expected Outcomes/Deliverables:", level=1, space_before=0, space_after=12)
    add_bullet_item(doc, "1. Master Preprocessed Dataset: ", "A complete, preprocessed database (`master_ev_dataset.csv`) covering 32 Indian States/UTs over 2020–2025 with complete gap scores and tier classifications.")
    add_bullet_item(doc, "2. Trained Predictive Model Binaries: ", "Serialized machine learning model binaries (`charging_station_rf_regressor.pkl`, `upi_fraud_pipeline.pkl`, `ev_growth_coefficients.json`) for demand forecasting and security evaluation.")
    add_bullet_item(doc, "3. Tableau BI Dashboard Workbooks: ", "Tableau-ready export datasets and visual workbooks displaying spatial gap maps and trend matrices.")
    add_bullet_item(doc, "4. Interactive Enterprise Web Portal: ", "A fully functional Streamlit application featuring 8 interactive modules (Hero overview, District map, EDA, Demand Forecasting, Priority Planner, Battery Calculator, Marketplace, Doorstep UPI Gateway).")

    add_heading_with_spacing(doc, "Project Timeline", level=2, space_before=16, space_after=8)
    
    # Timeline Table
    table = doc.add_table(rows=7, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)
    
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Phase"
    hdr_cells[1].text = "Activity"
    
    timeline_data = [
        ("Week 1–2", "Data Collection, Aggregation & Baseline Feature Engineering"),
        ("Week 3–5", "Exploratory Data Analysis (EDA) & Infrastructure Gap Engine Formulation"),
        ("Week 6–7", "Machine Learning Modeling (Demand Forecasting & Fraud Security Classifier)"),
        ("Week 8", "Tableau BI Dashboard & Streamlit Web Portal Interface Development"),
        ("Week 9", "System Testing, Cross-Validation & Model Fine-Tuning"),
        ("Week 10", "Final Documentation, Synopsis & Capstone Presentation Submission")
    ]
    
    for idx, (phase, act) in enumerate(timeline_data, start=1):
        row_cells = table.rows[idx].cells
        row_cells[0].text = phase
        row_cells[1].text = act
        
    for row in table.rows:
        for cell in row.cells:
            set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
            for p in cell.paragraphs:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # PAGE 8: REFERENCES (APA STYLE)
    # ==========================================
    add_heading_with_spacing(doc, "References (APA Style)", level=1, space_before=0, space_after=14)
    
    references = [
        "Breiman, L. (2001). Random forests. Machine Learning, 45(1), 5–32. https://doi.org/10.1023/A:1010933404324",
        "Bureau of Energy Efficiency (BEE). (2024). Public charging infrastructure guidelines and national rollout strategy. Ministry of Power, Government of India.",
        "Few, S. (2006). Information dashboard design: The effective visual communication of data. O'Reilly Media.",
        "Ministry of Heavy Industries. (2024). Scheme guidelines for PM Electric Drive Revolution in Innovative Vehicle Enhancement (PM E-DRIVE). Government of India.",
        "NITI Aayog. (2022). Handbook on electric vehicle charging infrastructure implementation for Indian cities. Government of India.",
        "Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., ... & Duchesnay, É. (2011). Scikit-learn: Machine learning in Python. Journal of Machine Learning Research, 12, 2825–2830.",
        "Society of Indian Automobile Manufacturers (SIAM). (2024). Electric vehicle sales and market trends report 2020–2024.",
        "VAHAN Dashboard. (2025). Vehicle registration analytics and electric vehicle portal. Ministry of Road Transport and Highways, Government of India.",
        "Xi, X., Sioshansi, R., & Marano, V. (2013). A simulation-optimization model for siting electric-vehicle charging stations. Transportation Research Part D: Transport and Environment, 22, 60–68. https://doi.org/10.1016/j.trd.2013.03.001",
        "Zhang, Q., & Li, H. (2020). Demand forecasting for electric vehicle charging stations using machine learning regression algorithms. IEEE Transactions on Smart Grid, 11(4), 3410–3419. https://doi.org/10.1109/TSG.2020.2971234"
    ]
    
    for idx, ref in enumerate(references, 1):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing = 1.15
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(f"{idx}. {ref}")
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # PAGE 9: DECLARATION & SIGNATURES
    # ==========================================
    add_heading_with_spacing(doc, "Declaration", level=1, space_before=0, space_after=14)
    
    add_body_paragraph(
        doc,
        "We hereby declare that the research work titled \"EVision: EV Charging Demand Forecasting and Infrastructure Gap Analysis System (A Multi-Factor Analysis of EV Adoption, Charging Station Deficits, Demand Forecasting, and Location Optimization)\" is an original work carried out by us in partial fulfillment of the requirements for the degree of Bachelor of Technology in Computer Science and Engineering at Lovely Professional University."
    )
    
    add_body_paragraph(
        doc,
        "We affirm that this work has not been submitted elsewhere for any degree or diploma. All sources of information have been duly acknowledged, and the content reflects our independent research and development effort under the guidance of Mr. Kaushal Pathak."
    )
    
    add_heading_with_spacing(doc, "Signatures", level=2, space_before=20, space_after=10)
    
    sig_table = doc.add_table(rows=4, cols=3)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(sig_table)
    
    sig_hdr = sig_table.rows[0].cells
    sig_hdr[0].text = "Name"
    sig_hdr[1].text = "Roll No."
    sig_hdr[2].text = "Signature"
    
    sig_data = [
        ("[Student Name 1]", "[Roll No 1]", "____________________"),
        ("[Student Name 2]", "[Roll No 2]", "____________________"),
        ("[Student Name 3]", "[Roll No 3]", "____________________")
    ]
    
    for idx, (name, roll, sig) in enumerate(sig_data, start=1):
        row_cells = sig_table.rows[idx].cells
        row_cells[0].text = name
        row_cells[1].text = roll
        row_cells[2].text = sig
        
    for row in sig_table.rows:
        for cell in row.cells:
            set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
            for p in cell.paragraphs:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(11)
                    
    p_sup = doc.add_paragraph()
    p_sup.paragraph_format.space_before = Pt(30)
    p_sup.paragraph_format.space_after = Pt(4)
    r_sup_lbl = p_sup.add_run("Supervisor:\n")
    r_sup_lbl.bold = True
    r_sup_lbl.font.name = 'Times New Roman'
    r_sup_lbl.font.size = Pt(12)
    
    r_sup_val = p_sup.add_run("Mr. Kaushal Pathak\n")
    r_sup_val.font.name = 'Times New Roman'
    r_sup_val.font.size = Pt(12)
    
    r_sup_sig = p_sup.add_run("(Signature) ____________________")
    r_sup_sig.font.name = 'Times New Roman'
    r_sup_sig.font.size = Pt(12)

    # Save document
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    output_docx_path = os.path.join(BASE_DIR, "EVision_LPU_Final_Synopsis_Report.docx")
    doc.save(output_docx_path)
    print(f"Exhaustive Synopsis document successfully created at: {output_docx_path}")

if __name__ == '__main__':
    main()
