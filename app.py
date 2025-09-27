from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import os
import json
from datetime import datetime
import csv
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'lca_tool_secret_key_2024')

# Ensure data directory exists
os.makedirs('data', exist_ok=True)
os.makedirs('static/uploads', exist_ok=True)

# CSV file paths
USER_DATA_CSV = 'data/user_inputs.csv'
LCA_RESULTS_CSV = 'data/lca_results.csv'
RECOMMENDATIONS_CSV = 'data/recommendations.csv'

def initialize_csv_files():
    """Initialize CSV files with headers if they don't exist"""
    
    # User inputs CSV
    if not os.path.exists(USER_DATA_CSV):
        user_headers = [
            'timestamp', 'user_id', 'metal_type', 'process_type', 'production_capacity',
            'energy_consumption', 'transport_distance', 'recovery_rate', 'end_of_life_scenario',
            'location', 'electricity_source', 'water_usage', 'raw_material_source'
        ]
        pd.DataFrame(columns=user_headers).to_csv(USER_DATA_CSV, index=False)
    
    # LCA results CSV
    if not os.path.exists(LCA_RESULTS_CSV):
        result_headers = [
            'timestamp', 'user_id', 'co2_footprint', 'energy_intensity', 'water_footprint',
            'material_recovery_potential', 'recyclability_score', 'circularity_index',
            'environmental_impact_score', 'sustainability_grade'
        ]
        pd.DataFrame(columns=result_headers).to_csv(LCA_RESULTS_CSV, index=False)
    
    # Recommendations CSV
    if not os.path.exists(RECOMMENDATIONS_CSV):
        rec_headers = [
            'timestamp', 'user_id', 'recommendation_type', 'description',
            'potential_savings_co2', 'potential_savings_cost', 'implementation_difficulty'
        ]
        pd.DataFrame(columns=rec_headers).to_csv(RECOMMENDATIONS_CSV, index=False)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/process-input')
def process_input():
    return render_template('process_input.html')

@app.route('/lca-analysis')
def lca_analysis():
    return render_template('lca_analysis.html')

@app.route('/visualization')
def visualization():
    return render_template('visualization.html')

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/api/submit-process', methods=['POST'])
def submit_process():
    try:
        data = request.json
        
        # Generate user ID and timestamp
        user_id = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        timestamp = datetime.now().isoformat()
        
        # Prepare data for CSV
        csv_data = {
            'timestamp': timestamp,
            'user_id': user_id,
            'metal_type': data.get('metalType', ''),
            'process_type': data.get('processType', ''),
            'production_capacity': data.get('productionCapacity', 0),
            'energy_consumption': data.get('energyConsumption', 0),
            'transport_distance': data.get('transportDistance', 0),
            'recovery_rate': data.get('recoveryRate', 0),
            'end_of_life_scenario': data.get('endOfLifeScenario', ''),
            'location': data.get('location', ''),
            'electricity_source': data.get('electricitySource', ''),
            'water_usage': data.get('waterUsage', 0),
            'raw_material_source': data.get('rawMaterialSource', '')
        }
        
        # Append to CSV
        df = pd.DataFrame([csv_data])
        df.to_csv(USER_DATA_CSV, mode='a', header=False, index=False)
        
        # Generate AI-powered LCA results
        lca_results = generate_lca_results(data, user_id, timestamp)
        
        # Generate recommendations
        recommendations = generate_recommendations(data, lca_results, user_id, timestamp)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'lca_results': lca_results,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def generate_lca_results(input_data, user_id, timestamp):
    """AI/ML simulation for LCA calculations"""
    
    # Simplified AI model simulation - in real implementation, this would use ML models
    metal_type = input_data.get('metalType', 'aluminium')
    process_type = input_data.get('processType', 'primary')
    production_capacity = float(input_data.get('productionCapacity', 1000))
    energy_consumption = float(input_data.get('energyConsumption', 500))
    
    # Base factors for different metals (kg CO2 per kg metal)
    base_factors = {
        'aluminium': {'primary': 12.5, 'secondary': 0.7},
        'copper': {'primary': 4.2, 'secondary': 1.8},
        'steel': {'primary': 2.3, 'secondary': 0.4}
    }
    
    base_co2 = base_factors.get(metal_type, base_factors['aluminium'])[process_type]
    
    # Calculate environmental metrics
    co2_footprint = base_co2 * production_capacity * (1 + energy_consumption / 1000)
    energy_intensity = energy_consumption / production_capacity if production_capacity > 0 else 0
    water_footprint = production_capacity * (50 if process_type == 'primary' else 20)  # L/kg
    
    # Circularity metrics
    recovery_rate = float(input_data.get('recoveryRate', 70))
    material_recovery_potential = min(95, recovery_rate + np.random.normal(10, 5))
    recyclability_score = 85 if process_type == 'secondary' else 60
    
    # Overall scores
    circularity_index = (material_recovery_potential + recyclability_score) / 2
    environmental_impact_score = max(0, 100 - (co2_footprint / production_capacity) * 5)
    
    # Sustainability grade
    overall_score = (circularity_index + environmental_impact_score) / 2
    if overall_score >= 80:
        sustainability_grade = 'A'
    elif overall_score >= 60:
        sustainability_grade = 'B'
    elif overall_score >= 40:
        sustainability_grade = 'C'
    else:
        sustainability_grade = 'D'
    
    results = {
        'co2_footprint': round(co2_footprint, 2),
        'energy_intensity': round(energy_intensity, 2),
        'water_footprint': round(water_footprint, 2),
        'material_recovery_potential': round(material_recovery_potential, 1),
        'recyclability_score': round(recyclability_score, 1),
        'circularity_index': round(circularity_index, 1),
        'environmental_impact_score': round(environmental_impact_score, 1),
        'sustainability_grade': sustainability_grade
    }
    
    # Save to CSV
    csv_data = {
        'timestamp': timestamp,
        'user_id': user_id,
        **results
    }
    df = pd.DataFrame([csv_data])
    df.to_csv(LCA_RESULTS_CSV, mode='a', header=False, index=False)
    
    return results

def generate_recommendations(input_data, lca_results, user_id, timestamp):
    """Generate AI-powered recommendations"""
    
    recommendations = []
    
    # Energy efficiency recommendations
    if lca_results['energy_intensity'] > 0.5:
        recommendations.append({
            'type': 'Energy Efficiency',
            'description': 'Implement energy recovery systems to reduce energy consumption by 15-25%',
            'potential_savings_co2': round(lca_results['co2_footprint'] * 0.20, 2),
            'potential_savings_cost': '₹15-25 lakhs annually',
            'implementation_difficulty': 'Medium'
        })
    
    # Process optimization
    if input_data.get('processType') == 'primary':
        recommendations.append({
            'type': 'Process Optimization',
            'description': 'Switch to 30% recycled content to reduce environmental impact by 35%',
            'potential_savings_co2': round(lca_results['co2_footprint'] * 0.35, 2),
            'potential_savings_cost': '₹50-80 lakhs annually',
            'implementation_difficulty': 'High'
        })
    
    # Circular economy opportunities  
    if lca_results['circularity_index'] < 70:
        recommendations.append({
            'type': 'Circular Economy',
            'description': 'Establish take-back programs to increase material recovery to 85%',
            'potential_savings_co2': round(lca_results['co2_footprint'] * 0.15, 2),
            'potential_savings_cost': '₹20-40 lakhs annually',
            'implementation_difficulty': 'Medium'
        })
    
    # Transport optimization
    transport_distance = float(input_data.get('transportDistance', 0))
    if transport_distance > 500:
        recommendations.append({
            'type': 'Logistics',
            'description': 'Switch to rail transport for distances > 500km to reduce transport emissions by 60%',
            'potential_savings_co2': round(transport_distance * 0.1, 2),
            'potential_savings_cost': '₹10-20 lakhs annually',
            'implementation_difficulty': 'Low'
        })
    
    # Save recommendations to CSV
    for rec in recommendations:
        csv_data = {
            'timestamp': timestamp,
            'user_id': user_id,
            'recommendation_type': rec['type'],
            'description': rec['description'],
            'potential_savings_co2': rec['potential_savings_co2'],
            'potential_savings_cost': rec['potential_savings_cost'],
            'implementation_difficulty': rec['implementation_difficulty']
        }
        df = pd.DataFrame([csv_data])
        df.to_csv(RECOMMENDATIONS_CSV, mode='a', header=False, index=False)
    
    return recommendations

@app.route('/api/get-analytics')
def get_analytics():
    """Get analytics data for dashboard"""
    try:
        # Read CSV files
        if os.path.exists(USER_DATA_CSV):
            user_df = pd.read_csv(USER_DATA_CSV)
            total_assessments = len(user_df)
            
            # Metal type distribution
            metal_distribution = user_df['metal_type'].value_counts().to_dict() if not user_df.empty else {}
        else:
            total_assessments = 0
            metal_distribution = {}
        
        if os.path.exists(LCA_RESULTS_CSV):
            results_df = pd.read_csv(LCA_RESULTS_CSV)
            avg_circularity = results_df['circularity_index'].mean() if not results_df.empty else 0
            avg_co2 = results_df['co2_footprint'].mean() if not results_df.empty else 0
        else:
            avg_circularity = 0
            avg_co2 = 0
        
        return jsonify({
            'total_assessments': total_assessments,
            'avg_circularity_index': round(avg_circularity, 1),
            'avg_co2_footprint': round(avg_co2, 2),
            'metal_distribution': metal_distribution
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export-data/<data_type>')
def export_data(data_type):
    """Export data as CSV"""
    try:
        file_mapping = {
            'user_inputs': USER_DATA_CSV,
            'lca_results': LCA_RESULTS_CSV,
            'recommendations': RECOMMENDATIONS_CSV
        }
        
        file_path = file_mapping.get(data_type)
        if file_path and os.path.exists(file_path):
            return send_file(file_path, as_attachment=True, download_name=f'{data_type}_{datetime.now().strftime("%Y%m%d")}.csv')
        else:
            return jsonify({'error': 'File not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    initialize_csv_files()
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)