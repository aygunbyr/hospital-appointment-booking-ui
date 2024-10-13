import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

function DashboardHome() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={4} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Doctors</Typography>
            <Typography variant="h2">5</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Patients</Typography>
            <Typography variant="h2">2</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Appointments</Typography>
            <Typography variant="h2">10</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DashboardHome;
