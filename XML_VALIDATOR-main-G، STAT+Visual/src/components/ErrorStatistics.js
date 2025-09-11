import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from 'lucide-react';

const StatisticsContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const StatisticsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const StatisticsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatisticsSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.color}15, ${props => props.color}25);
  border: 1px solid ${props => props.color}30;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const ChartTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const ErrorTypeList = styled.div`
  margin-top: 1rem;
`;

const ErrorTypeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ErrorTypeName = styled.div`
  font-weight: 500;
  color: #333;
`;

const ErrorTypeCount = styled.div`
  font-weight: 600;
  color: #dc2626;
`;

const ErrorTypePercentage = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16',
  '#f59e0b', '#10b981'
];

const getErrorTypeDisplayName = (errorType) => {
  const displayNames = {
    'syntax_error': 'Syntax Error',
    'schema_validation_error': 'Schema Validation Error',
    'element_error': 'Element Error',
    'attribute_error': 'Attribute Error',
    'type_error': 'Type Error',
    'namespace_error': 'Namespace Error',
    'required_field_error': 'Required Field Error',
    'value_error': 'Value Error',
    'structure_error': 'Structure Error',
    'unknown_error': 'Unknown Error'
  };
  return displayNames[errorType] || errorType.replace(/_/g, ' ').toUpperCase();
};

const ErrorStatistics = ({ statistics }) => {
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (statistics && statistics.error_types) {
      // Prepare data for pie chart
      const pieData = Object.entries(statistics.error_types).map(([type, count], index) => ({
        name: getErrorTypeDisplayName(type),
        value: count,
        percentage: statistics.error_percentages[type],
        color: COLORS[index % COLORS.length]
      }));

      // Prepare data for bar chart
      const barData = Object.entries(statistics.error_types).map(([type, count], index) => ({
        name: getErrorTypeDisplayName(type),
        count: count,
        percentage: statistics.error_percentages[type],
        color: COLORS[index % COLORS.length]
      }));

      setChartData(pieData);
      setBarData(barData);
    }
  }, [statistics]);

  if (!statistics || !statistics.error_types || Object.keys(statistics.error_types).length === 0) {
    return (
      <StatisticsContainer>
        <StatisticsHeader>
          <StatisticsTitle>
            <AlertTriangle size={24} color="#f59e0b" />
            Error Statistics
          </StatisticsTitle>
          <StatisticsSubtitle>No errors found to analyze</StatisticsSubtitle>
        </StatisticsHeader>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <StatisticsHeader>
        <StatisticsTitle>
          <TrendingUp size={24} color="#10b981" />
          Error Analysis & Statistics
        </StatisticsTitle>
        <StatisticsSubtitle>
          Comprehensive analysis of validation errors found in your XML files
        </StatisticsSubtitle>
      </StatisticsHeader>

      <StatsGrid>
        <StatCard color="#ef4444">
          <StatValue color="#ef4444">{statistics.total_errors}</StatValue>
          <StatLabel>Total Errors</StatLabel>
        </StatCard>
        
        <StatCard color="#f97316">
          <StatValue color="#f97316">{statistics.total_files}</StatValue>
          <StatLabel>Files with Errors</StatLabel>
        </StatCard>
        
        <StatCard color="#eab308">
          <StatValue color="#eab308">{Object.keys(statistics.error_types).length}</StatValue>
          <StatLabel>Error Types</StatLabel>
        </StatCard>
        
        <StatCard color="#22c55e">
          <StatValue color="#22c55e">
            {statistics.total_errors > 0 ? Math.round(statistics.total_errors / statistics.total_files) : 0}
          </StatValue>
          <StatLabel>Avg Errors per File</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsContainer>
        <ChartCard>
          <ChartTitle>
            <PieChartIcon size={20} color="#8b5cf6" />
            Error Distribution (Pie Chart)
          </ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} errors (${props.payload.percentage}%)`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <BarChart3 size={20} color="#06b6d4" />
            Error Count by Type (Bar Chart)
          </ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} errors (${props.payload.percentage}%)`,
                    'Count'
                  ]}
                />
                <Bar dataKey="count" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </ChartsContainer>

      <ErrorTypeList>
        <ChartTitle style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={20} color="#ef4444" />
          Detailed Error Breakdown
        </ChartTitle>
        {Object.entries(statistics.error_types)
          .sort(([,a], [,b]) => b - a) // Sort by count descending
          .map(([type, count], index) => (
            <ErrorTypeItem key={type}>
              <ErrorTypeName>{getErrorTypeDisplayName(type)}</ErrorTypeName>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ErrorTypeCount>{count}</ErrorTypeCount>
                <ErrorTypePercentage>({statistics.error_percentages[type]}%)</ErrorTypePercentage>
              </div>
            </ErrorTypeItem>
          ))}
      </ErrorTypeList>
    </StatisticsContainer>
  );
};

export default ErrorStatistics;
