'use client';

import { Box } from '@mui/material';
import { LineChart, axisClasses, lineElementClasses } from '@mui/x-charts';

interface ForecastPoint {
  date: string;
  temp: number;
  icon: string;
}

export default function WeatherGraph({ data }: { data: ForecastPoint[] }) {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        height={250}
        series={[
          {
            data: data.map((d) => d.temp),
            label: 'Temperature (°C)',
            color: '#1976d2',
          },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: data.map((d) => `${d.icon} ${d.date}`),
            label: 'Date',
          },
        ]}
        yAxis={[{ label: '°C' }]}
        sx={{
          [`& .${axisClasses.label}`]: { fontSize: 12 },
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2,
          },
        }}
      />
    </Box>
  );
}
