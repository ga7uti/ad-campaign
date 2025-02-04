// ReviewSection.tsx
import { Grid, Typography, TextField, Box } from '@mui/material';
import TargetType from './target-type';
import { utils } from '@/lib/common-utils';
import { DetailGrid, DetailRow, SectionContainer } from './section-container';

interface ReviewSectionProps {
  title: string;
  fields: Array<{
    label: string;
    name: string;
  }>;
  targetType: string;
  dataSources: any;
  getValues: any;
}

export const ReviewSection = ({
  title,
  fields,
  targetType,
  dataSources,
  getValues
}: ReviewSectionProps) => {
  return (
    <>
    <SectionContainer title={title}>
      <DetailGrid>
        {fields.map((field) => (
          <DetailRow 
                key={field.label}
                label={field.label}
                value={utils.formatAndGetReviewData(field.name, dataSources, getValues)}
            />
        ))}
      </DetailGrid>
    </SectionContainer>
    <SectionContainer title="Interest Targeting">
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {targetType &&
                    <TargetType 
                        targetType={targetType} 
                        isRemovable={false} 
                />
                }
            </Grid>
        </Grid>
    </SectionContainer>
  </>
  );
};