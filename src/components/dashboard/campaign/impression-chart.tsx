import { Box, Typography } from "@mui/material";
import { positions } from "@mui/system";
import { PieChart, useXAxis } from "@mui/x-charts";


interface ChartProps{
    title: string
    targetPopulation: number;
    totalPopulation: number;
}
export function ImpressionChart({
  title,
  totalPopulation = 0,
  targetPopulation = 0,
}: ChartProps): React.JSX.Element {

    return (
        <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                width: "100%",
              }}
            >
              <Typography sx={{
                  marginBottom: { xs: 2, sm: 3 },
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }} variant="h6">
                  {title}
                </Typography>
              <PieChart
                series={[
                  {
                    data: [
                        { id: 0, value: totalPopulation, label: `Total ${totalPopulation}` },
                        { id: 1, value: targetPopulation, label: `Target ${targetPopulation}` },
                    ],
                    type: 'pie',
                  },
                ]}
                width={350}
                height={400}
                slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' }, // Places the legend below the chart
                    },
                  }}
                />
          </Box>
    );
}