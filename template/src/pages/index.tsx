import React from 'react';
import { Redirect } from '@docusaurus/router';
import main from '../../cfg/main.json';

export default function Home() {
  return <Redirect to={main.url_home} />;
}
