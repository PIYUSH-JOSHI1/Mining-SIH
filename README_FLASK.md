# AI-Driven LCA Tool - Ministry of Mines

A comprehensive Flask web application for Life Cycle Assessment (LCA) analysis in metallurgy and mining, developed for the Indian Ministry of Mines and JNARDDC.

## Features

- **Multi-step Process Input**: Guided data entry with AI assistance
- **Advanced Analytics**: Real-time LCA calculations with circularity metrics
- **Interactive Visualizations**: Charts, Sankey diagrams, and trend analysis
- **Comprehensive Reports**: Multiple report formats for different audiences
- **Data Export**: CSV, Excel, and API integration capabilities
- **Government Compliance**: Aligned with Indian environmental regulations

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask application:
```bash
python app.py
```

3. Access the application at `http://localhost:5000`

## Project Structure

```
├── app.py                 # Main Flask application
├── templates/             # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── dashboard.html    # Analytics dashboard
│   ├── process_input.html # Multi-step form
│   ├── lca_analysis.html # Results display
│   ├── visualization.html # Interactive charts
│   ├── reports.html      # Report generation
│   └── settings.html     # System settings
├── static/
│   ├── css/
│   │   └── main.css      # Government-themed styles
│   ├── js/               # Page-specific JavaScript
│   └── images/           # Government logos
├── data/                 # CSV data storage
└── requirements.txt      # Python dependencies
```

## Usage

1. **Dashboard**: Overview of LCA metrics and system status
2. **Process Input**: Step-by-step data entry for metallurgical processes
3. **Analysis**: AI-powered LCA results with recommendations
4. **Visualization**: Interactive charts and material flow diagrams
5. **Reports**: Generate PDF reports for various audiences
6. **Settings**: Configure system preferences

## Government Compliance

This application complies with:
- Environment Impact Assessment (EIA) Notification 2006
- Central Pollution Control Board guidelines
- Ministry of Environment, Forest and Climate Change standards
- ISO 14040/14044 LCA standards

## Contact

For technical support: JNARDDC IT Department
Email: support@jnarddc.gov.in

## License

Government of India - Ministry of Mines
© 2024 All rights reserved