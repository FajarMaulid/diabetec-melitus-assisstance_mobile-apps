import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface ChartProps {
  data: number[];
  labels: string[];
}

const Chart = ({ data, labels }: ChartProps) => {
  const screenWidth = Dimensions.get('window').width;

  const processDataForChart = (data: number[], labels:string[]) => {
    if (!data || data.length === 0) {
      // Jika items tidak ada atau kosong, kembalikan data default
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    //const reversedLabel = labels
    //  .map(item =>
    //    new Date(item).toLocaleDateString('id-ID', {
    //      day: '2-digit',
    //      month: '2-digit',
    //    })
    //  ).reverse(); // Membalik urutan labels
    //
    //const reversedData = data
    //  .map(item => parseFloat(item))
    //  .reverse(); // Membalik urutan data

    return {
      labels: labels.slice(-5), // Hanya gunakan 5 data terbaru
      datasets: [
        {
          data: data.slice(-5), // Data untuk 5 pengukuran terakhir
          strokeWidth: 2, // Ketebalan garis
          color: () => `rgba(20, 184, 173, 1)`, // Warna garis
        },
      ],
    };
  };

  return (
    <LineChart
      data={processDataForChart(data, labels)}
      width={screenWidth - 20} // Lebar grafik (dengan margin)
      height={220} // Tinggi grafik
      chartConfig={{
        //backgroundColor: '#e26a00',
        backgroundGradientFrom: '#14B8AD',
        //backgroundGradientTo: '#00d4ff',
        decimalPlaces: 1, // Angka desimal
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: { borderRadius: 0 },
        propsForDots: {
          r: '6',
          //strokeWidth: '2',
          stroke: '#14B8AD',
        },
      }}
      bezier
      style={{ marginVertical: 0, borderRadius: 8 }}
    />
  );
}

export default Chart;
