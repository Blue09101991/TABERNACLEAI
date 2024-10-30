'use client'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})
import { isWindowAvailable } from '@/utils/navigation'

type ChartProps = {
  [x: string]: any
}
type ChartState = {
  chartData: any[]
  chartOptions: any
}

class LineChart extends React.Component<ChartProps, ChartState> {
  constructor(props: { chartData: any[]; chartOptions: any }) {
    super(props)

    this.state = {
      chartData: [],
      chartOptions: {},
    }
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    })
  }

  render() {
    if (!isWindowAvailable()) return <></>
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="line"
        width="100%"
        height="100%"
      />
    )
  }
}

export default LineChart
