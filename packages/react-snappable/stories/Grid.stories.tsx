import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Grid from "../src/components/Grid";
import Snappable from "../src/components/Snappable";

export default {
  title: "Playground",
  component: Grid,
  parameters: {
  },
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = (args) => (
  <Grid {...args}>
    <Snappable style={{ width: 500, height: 500, backgroundColor: "#bd0101" }}>
      <div>Drag Me</div>
    </Snappable>
  </Grid>
);

export const Default = Template.bind({});

Default.args = {};
