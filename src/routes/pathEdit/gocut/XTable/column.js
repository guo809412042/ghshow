import { numberDivide } from '../const';

export const columns = [
  {
    dataIndex: 'ds',
    title: '日期',
    key: 'ds',
  },
  {
    dataIndex: 'platform',
    title: '客户端',
    key: 'platform',
    render(text, record) {
      const { platform, } = record;

      return +platform === 2 ? 'IOS' : '安卓';
    },
  },
  {
    dataIndex: 'App_Launch',
    title: 'app启动',
    key: 'App_Launch',
    render(text, record) {
      const { App_Launch, app_launch , platform } = record;

      return +platform === 2 ? app_launch : App_Launch;
    },
  },
  {
    dataIndex: 'Home_Show',
    title: '主页曝光',
    key: 'Home_Show',
    render(text, record) {
      const { Home_Show, Home_ff, platform } = record;

      return +platform === 2 ? Home_Show : Home_ff;
    },
  },
  {
    dataIndex: 'Home_edit_click',
    title: '编辑按钮点击',
    key: 'Home_edit_click',
  },
  {
    dataIndex: 'D/C',
    title: '编辑按钮点击率',
    key: 'D/C',
    render(text, record) {
      const { Home_Show, Home_ff, platform, Home_edit_click } = record;
      if (+platform === 2) {
        return numberDivide(Home_edit_click, Home_Show) + '%';
      }
      return numberDivide(Home_edit_click, Home_ff) + '%';
    },
  },
  {
    dataIndex: 'gallery_ff',
    title: '相册页曝光',
    key: 'gallery_ff',
  },
  {
    dataIndex: 'F/D',
    title: '相册页进入率',
    key: 'F/D',
    render(text, record) {
      const { gallery_ff, Home_edit_click, } = record;
      return numberDivide(gallery_ff, Home_edit_click) + '%';
    },
  },
  {
    dataIndex: 'Edit_ff',
    title: '编辑页曝光',
    key: 'Edit_ff',
  },
  {
    dataIndex: 'H/F',
    title: '编辑页曝光率',
    key: 'H/F',
    render(text, record) {
      const { Edit_ff, gallery_ff, } = record;
      return numberDivide(Edit_ff, gallery_ff) + '%';
    },
  },
  {
    dataIndex: 'Edit_export_click',
    title: '导出按钮点击',
    key: 'Edit_export_click',
  },
  {
    dataIndex: 'J/H',
    title: '导出率',
    key: 'J/H',
    render(text, record) {
      const { Edit_export_click, Edit_ff, } = record;
      return numberDivide(Edit_export_click, Edit_ff) + '%';
    },
  },
  {
    dataIndex: 'J/C',
    title: '主页到导出点击率',
    key: 'J/C',
    render(text, record) {
      const { Edit_export_click, Home_Show, Home_ff, platform, } = record;
      if (+platform === 2) {
        return numberDivide(Edit_export_click, Home_Show) + '%';
      }
      return numberDivide(Edit_export_click, Home_ff) + '%';
    },
  },
  {
    dataIndex: 'Videoedit_Share_Show',
    title: '分享页展示',
    key: 'Videoedit_Share_Show',
    render(text, record) {
      const { Videoedit_Share_Show, Share_exposure, platform, } = record;

      return +platform === 2 ? Videoedit_Share_Show : Share_exposure;
    },
  },
  {
    dataIndex: 'Videoedit_Share_Click',
    title: '分享页分享点击',
    key: 'Videoedit_Share_Click',
    render(text, record) {
      const { Videoedit_Share_Click, Share_share_click, platform, } = record;

      return +platform === 2 ? Videoedit_Share_Click : Share_share_click;
    },
  },
  {
    dataIndex: 'N/M',
    title: '分享率',
    key: 'N/M',
    render(text, record) {
      const { Videoedit_Share_Click, Share_share_click, platform, Videoedit_Share_Show, Share_exposure, } = record;
      if (+platform === 2) {
        return numberDivide(Videoedit_Share_Click, Videoedit_Share_Show) + '%';
      }
      return numberDivide(Share_share_click, Share_exposure) + '%';
    },
  },
  {
    dataIndex: 'N/C',
    title: '主页到分享率',
    key: 'N/C',
    render(text, record) {
      const { Videoedit_Share_Click, Share_share_click, platform, Home_Show, Home_ff, } = record;
      if (+platform === 2) {
        return numberDivide(Videoedit_Share_Click, Home_Show) + '%';
      }
      return numberDivide(Share_share_click, Home_ff) + '%';
    },
  },
];
