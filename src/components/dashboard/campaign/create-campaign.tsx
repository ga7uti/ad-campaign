"use client"
import { campaignClient } from '@/lib/campaign-client';
import { paths } from '@/paths';
import { CampaignFormData, CommonSelectResponse, ImpressionData, Interest, Location } from '@/types/campaign';
import { CampaignFormSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';
import { ProgressIndicator } from '../layout/progress-indicator';
import { CampaignTypeSelector } from './campaign-select';
import CardSection from '../layout/card-section';
import { ImpressionComponent } from './impression-panel';
import dayjs from 'dayjs';
import { CreateCampaignProps } from '@/types/props';

const reviewFields = [
  { label: "CampaignName", name: "name" },
  { label: "CampaignType", name: "objective" },
  { label: "Start Time", name: "start_time" },
  { label: "End Time", name: "end_time" },
  { label: "Locations", name: "location" },
  { label: "AgeRange", name: "age" },
  { label: "Exchange", name: "exchange" },
  { label: "Language", name: "language" },
  { label: "Viewability", name: "viewability" },
  { label: "BrandSafety", name: "brand_safety" },
  { label: "Devices", name: "device" },
  { label: "Environments", name: "environment" },
  { label: "Carrier", name: "carrier" },
  { label: "DevicePrice", name: "device_price" },
  { label: "Interest", name: "target_type" },
  { label: "TotalBudget", name: "total_budget" },
  { label: "BuyType", name: "buy_type" },
  { label: "UnitRate", name: "unit_rate" },
  { label: "LandingPage", name: "landing_page" },
  { label: "Tag&Tracker", name: "tag_tracker" },
  { label: "Image", name: "images" },
  { label: "Video", name: "video" },
  { label: "Keywords", name: "keywords" },
];

export default function CreateCampaign({
  dataSources,
  impressionData,
  totalPopulation,
  setDataSources
}:CreateCampaignProps): React.JSX.Element {

    const router = useRouter();
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [isCampaignCreated,setIsCampaignCreated] = React.useState<boolean>(false);
    const [targetPopulation, setTargetPopulation] = React.useState<number>(0);
    const [activeSection, setActiveSection] = React.useState<number>(0); 
    const [campaignType, setCampaignType] = React.useState<'Banner' | 'Video'>('Banner');
    const [targetType, setTargetType] = React.useState<string>('');
    const mandatoryFieldsBySection: Record<number, string[]> = {
      0: ["objective"], 
      1: ["name","start_time","end_time"],
      2: ["location", "age", "exchange", "language", "viewability", "brand_safety"], 
      3: ["device", "environment", "carrier", "device_price"],
      4: ["interest_category", "target_type"],
      5: ["total_budget", "buy_type", "unit_rate"], 
      6: campaignType === "Banner" ? ["images"] : ["video"],
    };
    const {
      register,
      setValue,
      setError,
      clearErrors,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm<CampaignFormData>({ resolver: zodResolver(CampaignFormSchema) });
  
    const onSubmit = async (data: CampaignFormData) => {
      clearErrors();
      if(!data) 
        return;

      setIsPending(true);
      try {
        const result = await campaignClient.postCampaign(data);
        if (result) {
          setIsCampaignCreated(true);
          setTimeout(()=>{
            router.push(paths.dashboard.overview);
          },1000)
        }
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      } finally {
        setIsPending(false);
      }
    };
  
    const handleSelectChange = async (event: SelectChangeEvent<unknown>,
      name: string
    ) => {
      
      if(name === 'target_type'){
        const selectedValue: number[] = event.target.value as number[];
        const tempData = selectedValue.map((interest) => { 
          const tempData= dataSources.interest.find((i:Interest) => i.id === interest) as Interest
          return tempData.category+">"+tempData.subcategory;
        }).join(", ");
        setTargetType(tempData);
      }
      
      if (name === "interest_category") {
        const selectedValue: string = event.target.value as string;
        try {
            const result = await campaignClient.getInterest(selectedValue);
            setDataSources((prev: any) => ({
              ...prev,
              selectedInterest: result,
            }));
        } catch (error) {
          setError('root', { type: 'server', message: "Error fetching categories. Error: "+ error});
        }
      }
      
      if(name === "location" || name === "age"){
        const selectedValue: string[] = event.target.value as string[];
        const selectedLocs = name==="age"? getValues("location"): Array.from(
          new Set([...selectedValue, ...getValues("location") as Number[]])
        ) as string[];
        
        const selectedAges = name==="location"? getValues("age"): Array.from(
          new Set([...selectedValue, ...getValues("age") as string[]])
        ) as string[];
        
        // Calculate effective values
        const effectivePopulation = selectedLocs ? selectedLocs.reduce((total:number, locationId) => {
          const location = dataSources.location?.find((loc:Location) => loc.id === locationId) as Location;
          return total + (Number(location?.population) || 0);
        }, 0):0;
      
        const effectivePercentage = selectedAges ? selectedAges.reduce((total, label) => {
          const ageGroup = impressionData?.age?.find(age => age.label === label);
          return total + (ageGroup?.percentage || 0);
        }, 0):0;

        effectivePercentage > 0 ? setTargetPopulation(Math.round((effectivePopulation * effectivePercentage) / 100)) 
          : setTargetPopulation(effectivePopulation);
      }

    };

    const nextSection = () => {
      const mandatoryFields = mandatoryFieldsBySection[activeSection];
    
      const isSectionValid = mandatoryFields.every((field) => {
        const value = getValues(field as  keyof CampaignFormData);
        const isValidField = value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0);;
        if(field === "total_budget" || field === "unit_rate") {
          return isValidField && !isNaN(Number(value)) && Number(value) > 0;
        }
        
        if(field === "images" || field === "video" || field === "tag_tracker") {
          return isValidField &&  (value as unknown as FileList).length > 0;
        }
        
        if(field === "end_time"){
          const startDate = getValues("start_time") as unknown as number;
          return isValidField && dayjs(value as number).isAfter(dayjs(startDate));
        }
        return isValidField;
      });
          
      if (!isSectionValid) {
        mandatoryFields.find((field) => {
          const value = getValues(field as  keyof CampaignFormData);
          let isFieldMissing =  value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0) 
          let startDateError = false;
          if(field === "total_budget" || field === "unit_rate"){
             isFieldMissing = isFieldMissing || isNaN(Number(value)) || Number(value) <= 0;
          }else if(field === "images" || field === "video" || field === "tag_tracker"){
            isFieldMissing= isFieldMissing || (value as unknown as FileList).length === 0;
          }else if(field === "end_time"){
            const startDate = getValues("start_time") as unknown as number;
            startDateError = isFieldMissing || !dayjs(value as number).isAfter(dayjs(startDate));
          }
          
          if (isFieldMissing) {
            const capitalizeFirstLetter = field.charAt(0).toUpperCase() + field.slice(1);
            setError(field as  keyof CampaignFormData, {type: "required",message: `${capitalizeFirstLetter.replace("_"," ")} field is required`});
          }

          if(startDateError){
            setError(field as  keyof CampaignFormData, {type: "invalid",message: "End date should be after start date"});
          }
        });
        return;
      } 

      clearErrors();
      if (activeSection < 7) {
        setActiveSection(activeSection + 1);
      }
    };

    const prevSection = () => {
        if (activeSection > 0) {
            setActiveSection(activeSection - 1);
        }
    };
  
    const getData = (name: string): string => {
      const value = getValues(name as keyof CampaignFormData);
      if(value){
        if (name === "location") {
          return (value as number[]).map((loc) => (dataSources.location.find((l:Location) => l.id === loc) as Location)?.city).join(", ");
        }

        if(name === "target_type"){
          return (value as number[]).map((interest) => { 
            const tempData= dataSources.interest.find((i:Interest) => i.id === interest) as Interest
            return tempData.category+">"+tempData.subcategory;
          }).join(", ");
        }

        if(name === "start_time" || name === "end_time"){
          return dayjs(value as number).format("YYYY-MM-DD");
        }

        if(name === "images" || name === "video" || name === "keywords" || name === "target_type"){
          return (value as unknown as FileList).length !== 0 ? "File uploaded" : "Not Provided";
        }
        return value as string
      } 

      return "Not provided";
    }
    
    React.useEffect(() => {
      if(!getValues("objective"))
        setValue('objective', 'Banner');
    }, [campaignType,targetPopulation]);
  
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: { xs: 2, sm: 3, md: 4 },
          p: { xs: 1, sm: 2, md: 3 },
          
        }}
      >
        <Box sx={{ flex: { xs: "1", md: "2" , lg:"3"}, overflow: "hidden" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", 
                flexDirection: "column",
                gap: 3 ,
                border: 1,
                padding:2 ,
                borderColor: "grey.300",
            }}>

              <ProgressIndicator activeSection={activeSection} totalSections={8} />

              {activeSection === 0 && (
                 <CardSection title="Campaign Type">
                    <CampaignTypeSelector campaignType={campaignType} setCampaignType={setCampaignType} setValue={setValue} />
                  </CardSection>
               )}

              {activeSection === 1 && (
                  <CardSection title="Campaign Details">
                    {/* Name */}
                    <Box sx={{margin:2}}>
                      <FormField
                          type="text"
                          placeholder="Name"
                          name="name"
                          getValues={getValues}
                          register={register}
                          error={errors.name}
                      />
                    </Box>
                    <Box sx={{ margin: 2 }}>
                      <FormField
                        type="datepicker"
                        placeholder="Start Date"
                        name="start_time"
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                        error={errors.start_time}
                      />
                    </Box>
                    <Box sx={{ margin: 2 }}>
                      <FormField
                        type="datepicker"
                        placeholder="End Date"
                        name="end_time"
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                        error={errors.end_time}
                      />
                    </Box>
                  </CardSection>
              )}

              {activeSection === 2 && (
                <CardSection title="Targeting Type">
                
                {/* Location */}
                <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="Locations"
                          name="location"
                          register={register}
                          getValues={getValues}
                          onChange={handleSelectChange}
                          error={Array.isArray(errors.location)?errors.location[0]:errors.location}
                          data={dataSources.location.length > 0 ? dataSources.location : [{ id: 0, city: 'No data available. Please try again later' }]}
                      />
                  </Box>

                  {/* Age */}
                  <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="Age Range"
                          name="age"
                          register={register}
                          getValues={getValues}
                          onChange={handleSelectChange}
                          error={Array.isArray(errors.age)?errors.age[0]:errors.age}
                          data={dataSources.ages.length > 0 ? dataSources.ages : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                  </Box>


                  
                  {/* Exchange */}
                  <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="Exchange"
                          name="exchange"
                          register={register}
                          getValues={getValues}
                          error={Array.isArray(errors.exchange)?errors.exchange[0]:errors.exchange}
                          data={dataSources.exchange.length > 0 ? dataSources.exchange : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                  </Box>

                 

                  {/* Langugage */}
                  <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="Language"
                          name="language"
                          register={register}
                          getValues={getValues}
                          error={Array.isArray(errors.language)?errors.language[0]:errors.language}
                          data={dataSources.language.length > 0 ? dataSources.language : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>

                  {/* Viewability*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="select"
                        placeholder="Viewability"
                        name="viewability"
                        register={register}
                        getValues={getValues}
                        error={Array.isArray(errors.viewability)?errors.viewability[0]:errors.viewability}
                        data={dataSources.viewability.length > 0 ? dataSources.viewability : [{ id: 0, value: 'No data available. Please try again later' }]}
                        multiple={false}
                        />
                  </Box>

                  {/* Brandsafety*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="select"
                        placeholder="Brand Safety"
                        name="brand_safety"
                        register={register}
                        getValues={getValues}
                        error={Array.isArray(errors.brand_safety)?errors.brand_safety[0]:errors.brand_safety}
                        data={dataSources.brand_safety.length > 0 ? dataSources.brand_safety : [{ id: 0, value: 'No data available. Please try again later' }]}
                        multiple={false}
                        />
                  </Box>
                </CardSection>
              )}

              {activeSection === 3 && (
                  <CardSection title="Device & Environment">
                    {/* Device */}
                    <Box sx={{margin:2}}>
                      <FormField
                            type="select"
                            placeholder="Devices"
                            name="device"
                            register={register}
                            getValues={getValues}
                            error={Array.isArray(errors.device)?errors.device[0]:errors.device}
                            data={dataSources.devices.length > 0 ? dataSources.devices : [{ id: 0, value: 'No data available. Please try again later' }]}
                        />
                      </Box>

                    {/* Environment */}
                    <Box sx={{margin:2}}>
                        <FormField
                            type="select"
                            placeholder="Environments"
                            name="environment"
                            register={register}
                            getValues={getValues}
                            error={Array.isArray(errors.environment)?errors.environment[0]:errors.environment}
                            data={dataSources.environment.length > 0 ? dataSources.environment : [{ id: 0, value: 'No data available. Please try again later' }]}
                        />
                    </Box>

                     {/* Carrier */}
                    <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="Carrier"
                          name="carrier"
                          register={register}
                          getValues={getValues}
                          error={Array.isArray(errors.carrier)?errors.carrier[0]:errors.carrier}
                          data={dataSources.carrier.length > 0 ? dataSources.carrier : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>

                    {/* DevicePrice */}
                    <Box sx={{margin:2}}>
                      <FormField
                          type="select"
                          placeholder="DevicePrice"
                          name="device_price"
                          register={register}
                          getValues={getValues}
                          error={Array.isArray(errors.device_price)?errors.device_price[0]:errors.device_price}
                          data={dataSources.device_price.length > 0 ? dataSources.device_price : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>
                  
                  </CardSection>
              )}

              {activeSection === 4 && (
                <CardSection title="Interest">
                {/* Interest */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="select"
                        placeholder="Category"
                        name="interest_category"
                        register={register}
                        getValues={getValues}
                        onChange={handleSelectChange}
                        multiple ={false}
                        data={dataSources.interest_category.length > 0 ? dataSources.interest_category : [{ id: 0, value: 'No data available. Please try again later' }]}
                        error={Array.isArray(errors.interest_category)?errors.interest_category[0]:errors.interest_category}
                    />
                  </Box>

                {/* Interest Category*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="select"
                        placeholder="SubCategory"
                        name="target_type"
                        register={register}
                        getValues={getValues}
                        onChange={handleSelectChange}
                        error={Array.isArray(errors.target_type)?errors.target_type[0]:errors.target_type}
                        data={dataSources.selectedInterest.length > 0 ? dataSources.selectedInterest.slice(0,150) : [{ id: 0, category: 'No data available. Please select Interest' }]}
                        />
                  </Box>
                  <Box sx={{ 
                    margin: 2,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap' 
                  }}>
                    {targetType.split(',').map((value, index) => (
                      <Typography 
                        key={index}
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          padding: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: 1,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {value.trim()}
                      </Typography>
                    ))}
                  </Box>

                </CardSection>
              )}

              {activeSection === 5 && (
                <CardSection title="Budget & Bidding">
                  {/* Total Budget */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="number"
                        placeholder="Total Budget"
                        name="total_budget"
                        valueAsNumber={true}
                        register={register}
                        getValues={getValues}
                        error={Array.isArray(errors.total_budget)?errors.total_budget[0]:errors.total_budget}
                    />
                  </Box>

                  {/* Buy Type*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="select"
                        placeholder="Buy Type"
                        name="buy_type"
                        register={register}
                        error={errors.buy_type}
                        getValues={getValues}
                        data={dataSources.buy_type.length > 0 ? dataSources.buy_type : [{ id: 0, value: 'No data available. Please try again later' }]}
                        multiple={false}
                        />
                  </Box>

                  {/* Unit Rate*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="number"
                        placeholder="Unit Rate"
                        name="unit_rate"
                        valueAsNumber={true}
                        getValues={getValues}
                        register={register}
                        error={Array.isArray(errors.unit_rate)?errors.unit_rate[0]:errors.unit_rate}
                        />
                  </Box>
                </CardSection>
              )}

              {activeSection === 6 && (
                <CardSection title="Ad Details">
                  {/* Landing Page */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Landing Page"
                        name="landing_page"
                        register={register}
                        getValues={getValues}
                        error={errors.landing_page}
                        data={undefined}
                    />
                  </Box>

                  {/* Tag & Tracker */}
                  <Box sx={{margin:2}}>
                    <FileUpload
                        name="tag_tracker"
                        register={register}
                        setValue={setValue}
                        getValue={getValues}
                        placeholder="Select Tag & Tracker(.xlsx)"
                      />
                      {errors.tag_tracker && 
                        <Typography sx={{ color: 'red', fontSize: '0.75rem' }}>
                          {errors.tag_tracker?.message}
                        </Typography>
                      }
                  </Box>
                  
                  {/* Image Upload */}
                  {campaignType === 'Banner' ? (
                    <Box sx={{margin:2}}>
                      <FileUpload
                          name="images"
                          register={register}
                          setValue={setValue}
                          getValue={getValues}
                          placeholder="Select Campaign Image(.jpeg,.png,.zip)"
                        />
                        {errors.images && 
                          <Typography sx={{ color: 'red', fontSize: '0.75rem' }}>
                            {errors.images?.message}
                          </Typography>
                        }
                    </Box>
                  ):
                  (
                    <Box sx={{margin:2}}>
                      <FileUpload
                          name="video"
                          register={register}
                          setValue={setValue}
                          getValue={getValues} 
                          placeholder="Select Campaign Video(.mp4,"
                        />
                        {errors.video && 
                          <Typography sx={{ color: 'red', fontSize: '0.75rem' }}>
                            {errors.video?.message}
                          </Typography>
                        }
                    </Box>
                  )}
                  <Box sx={{margin:2}}>
                    <FileUpload
                      name="keywords"
                      register={register}
                      getValue={getValues} 
                      setValue={setValue}
                      placeholder="Select Keywords(.pdf)"
                    />
                    {errors.keywords && 
                      <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                        {errors.keywords?.message}
                      </Typography>
                    }
                  </Box>
                </CardSection>
              )}

              {activeSection === 7 && (
                <>
                  <Box sx={{ padding: 2 }}>
                    {reviewFields.map((field, index) => (
                      <Box key={index} sx={{ mb: 2, display:"flex", flex: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', flex: 1 }}>{field.label}:</Typography>
                          <TextField
                            value={getData(field.name)}
                            variant="outlined"
                            size="small"
                            sx={{ flex: 2 }}
                          />
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                  {!isPending ? (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                          <Button sx={{borderRadius:0.75}} variant="contained" color="primary" type="submit">
                            Create Campaign
                          </Button>
                        </Box>
                  ):(
                    <Box sx={{ textAlign: "center", mt: 3 }}>
                      <Box sx={{ marginLeft: 2 }}>
                          <CircularProgress />
                        </Box>
                      </Box>
                  )}
                  </Box>
                </>
              )}
            
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={prevSection} disabled={activeSection === 0}>
                  Previous
                </Button>
                {activeSection < 7 && (
                  <Button variant="contained" color="primary" onClick={nextSection}>
                    {activeSection === 6 ? "Review" : "Next"}
                  </Button>
                )}
              </Box>
            </Box>

            <>
              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
              {isCampaignCreated ? <Alert sx={{margin:2}} color="success">Campaign created successfully!</Alert> : null}
            </>
          </form>
        </Box>

        {/* Right Section (Chart) */}
        <Box
          sx={{
            flex: { xs: "1", md: "1", lg:"1" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
            p: 2,
            border:1,
            borderColor: "grey.200",
            position: "sticky",
            top: '72px',
            alignSelf: 'flex-start',
          }}
        >
          <ImpressionComponent title= " Campaign Population Breakdown" targetPopulation={targetPopulation} totalPopulation={totalPopulation} />
        </Box>
      </Box>
    );
  }

  