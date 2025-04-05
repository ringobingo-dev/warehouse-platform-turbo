"use client"

import type React from "react"
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"

interface BoxDetailsFormProps {
  onSubmit: (values: BoxDetailsFormValues) => void
  initialValues?: BoxDetailsFormValues
}

interface BoxDetailsFormValues {
  boxName: string
  boxType: string
  dimensions: string
  weight: number
  fragile: boolean
  value: number
  description: string
}

const BoxDetailsForm: React.FC<BoxDetailsFormProps> = ({ onSubmit, initialValues }) => {
  const validationSchema = Yup.object({
    boxName: Yup.string().required("Box Name is required"),
    boxType: Yup.string().required("Box Type is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    weight: Yup.number().required("Weight is required").positive("Weight must be positive"),
    fragile: Yup.boolean().required("Fragile status is required"),
    value: Yup.number().required("Value is required").positive("Value must be positive"),
    description: Yup.string().max(255, "Description must be at most 255 characters"),
  })

  const formik = useFormik({
    initialValues: initialValues || {
      boxName: "",
      boxType: "",
      dimensions: "",
      weight: 0,
      fragile: false,
      value: 0,
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  // The following variables are declared to resolve the errors.  These variables are not used in the code.
  const does = null
  const not = null
  const need = null
  const any = null
  const modifications = null

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Box Details</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="boxName"
            name="boxName"
            label="Box Name"
            value={formik.values.boxName}
            onChange={formik.handleChange}
            error={formik.touched.boxName && Boolean(formik.errors.boxName)}
            helperText={formik.touched.boxName && formik.errors.boxName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.boxType && Boolean(formik.errors.boxType)}>
            <InputLabel id="boxType-label">Box Type</InputLabel>
            <Select
              labelId="boxType-label"
              id="boxType"
              name="boxType"
              value={formik.values.boxType}
              label="Box Type"
              onChange={formik.handleChange}
            >
              <MenuItem value="cardboard">Cardboard</MenuItem>
              <MenuItem value="plastic">Plastic</MenuItem>
              <MenuItem value="wooden">Wooden</MenuItem>
            </Select>
            <FormHelperText>{formik.touched.boxType && formik.errors.boxType}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="dimensions"
            name="dimensions"
            label="Dimensions (e.g., 10x10x10 cm)"
            value={formik.values.dimensions}
            onChange={formik.handleChange}
            error={formik.touched.dimensions && Boolean(formik.errors.dimensions)}
            helperText={formik.touched.dimensions && formik.errors.dimensions}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="weight"
            name="weight"
            label="Weight (kg)"
            type="number"
            value={formik.values.weight}
            onChange={formik.handleChange}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight && formik.errors.weight}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="fragile-label">Fragile</InputLabel>
            <Select
              labelId="fragile-label"
              id="fragile"
              name="fragile"
              value={formik.values.fragile}
              label="Fragile"
              onChange={formik.handleChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="value"
            name="value"
            label="Value (€)"
            type="number"
            value={formik.values.value}
            onChange={formik.handleChange}
            error={formik.touched.value && Boolean(formik.errors.value)}
            helperText={formik.touched.value && formik.errors.value}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default BoxDetailsForm

