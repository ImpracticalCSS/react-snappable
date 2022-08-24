import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Grid from '../src/components/Grid';

export default {
  title: 'Playground',
  component: Grid,
  parameters: {
    // layout: 'fullscreen',
  },
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = (args) => <Grid {...args} />;

export const Default = Template.bind({});

Default.args = {}
