/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Breadcrumb } from 'antd';
import { menus } from './menuJson';

export const BreadcrumbMenu = () => {
  const url = window.location.href.split('#')[1];
  let currentMenu = {};
  for (const i of menus) {
    if (i.children) {
      for (const j of i.children) {
        if (j.router === url) {
          currentMenu = j;
        }
      }
    } else if (i.router === url) {
      currentMenu = i;
    }
  }
  return (
    <Breadcrumb style={{ marginBottom: 20 }}>
      <Breadcrumb.Item>{currentMenu.pTitle}</Breadcrumb.Item>
      <Breadcrumb.Item>{currentMenu.title}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
