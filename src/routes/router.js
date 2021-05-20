export default [
  {
    path: '/',
    component: () => import('./index'),
    routes: [
      {
        path: '/gh/dashboard/viva-availability',
        exact: true,
        component: () => import('./dashboard/viva/AvailabilityIndex'),
      },
      {
        path: '/gh/dashboard/:product',
        exact: true,
        component: () => import('./dashboard/Index'),
      },
      // {
      //   path: '/gh/template-inline',
      //   component: () => import('./templateInline/Index'),
      // },
      {
        path: '/gh/okr/viva',
        exact: true,
        component: () => import('./okr/viva/Index'),
      },
      {
        path: '/gh/okr/vid',
        exact: true,
        component: () => import('./okr/vid/core/Index'),
      },
      {
        path: '/gh/okr-hour/vid',
        exact: true,
        component: () => import('./okr/vid/hourCore/Index'),
      },
      {
        path: '/gh/okr-push/vid',
        exact: true,
        component: () => import('./okr/vid/push'),
      },
      {
        path: '/gh/okr-tool/vid',
        exact: true,
        component: () => import('./okr/vid/tool/Index'),
      },
      {
        path: '/gh/okr-ad/vid',
        exact: true,
        component: () => import('./okr/vid/ad/Index'),
      },
      {
        path: '/gh/okr-remain/:product',
        exact: true,
        component: () => import('./okr/vid/remain/index'),
      },
      {
        path: '/gh/okr-crawler/vid',
        exact: true,
        component: () => import('./okr/vid/subplatformCrawler/index'),
      },
      {
        path: '/gh/okr-performance-analysis/:product',
        exact: true,
        component: () => import('./okr/vid/performanceAnalysis'),
      },
      {
        path: '/gh/okr-template/:product',
        exact: true,
        component: () => import('./okr/vid/template/Index'),
      },
      {
        path: '/gh/gp-add/vid',
        exact: true,
        component: () => import('./okr/vid/gpAdd/Index'),
      },
      {
        path: '/gh/okr-china',
        component: () => import('./okrChina/Index'),
      },
      {
        path: '/gh/home/:product',
        component: () => import('./home/View'),
        models: () => [import('../models/home/index')],
      },
      {
        path: '/gh/basic/overview',
        component: () => import('./basicData/allOverview/index'),
      },
      {
        path: '/gh/basic/stay',
        component: () => import('./basicData/stay/index'),
      },
      {
        path: '/gh/basic/sale',
        component: () => import('./basicData/sale/index'),
      },
      {
        path: '/gh/funnel/:product',
        exact: true,
        component: () => import('./funnel'),
      },
      {
        path: '/gh/funnelnew/:product/:funnelType',
        exact: true,
        component: () => import('./funnel'),
      },
      {
        path: '/gh/funnel/:product/:id/:funnelType',
        exact: true,
        component: () => import('./funnel/Components/Chart'),
      },
      {
        path: '/gh/config',
        component: () => import('./configs/Index'),
      },
      {
        path: '/gh/material/viva',
        component: () => import('./material/viva/Index'),
      },
      {
        path: '/gh/material/analysis/vivamini',
        component: () => import('./material/vivamini/analysis/Index'),
      },
      {
        path: '/gh/material/buy/vivamini',
        component: () => import('./material/vivamini/buy'),
      },
      {
        path: '/gh/material/pay/vivamini',
        component: () => import('./material/vivamini/pay'),
      },
      {
        path: '/gh/material/VD/tempo/corepath',
        component: () => import('./material/VD/tempo/corepath'),
      },
      {
        path: '/gh/material/VD/tempo/feedback',
        component: () => import('./material/VD/tempo/feedback'),
      },
      {
        path: '/gh/material/VD/facee/feedback',
        component: () => import('./material/VD/facee/feedback'),
      },
      {
        path: '/gh/material/VD/multiball/feedback',
        component: () => import('./material/VD/multiball/feedback'),
      },
      {
        path: '/gh/material/VD/:product',
        component: () => import('./material/VD'),
      },
      {
        path: '/gh/material/analysis/:product',
        component: () => import('./material/vid/analysis/Index'),
      },

      // {
      //   path: '/gh/vid/user-analytics/creator',
      //   component: () => import('./userAnalysis/vid/creatorUser/Index'),
      // },
      {
        path: '/gh/event/:product',
        component: () => import('./event/Index'),
      },
      {
        path: '/gh/video/tag-video',
        exact: true,
        component: () => import('./videoAnalytics/vid/tagVideo/Index'),
      },
      {
        path: '/gh/video/hot-video',
        exact: true,
        component: () => import('./videoAnalytics/vid/hotVideo/Index'),
      },
      {
        path: '/gh/video/tag-hot',
        exact: true,
        component: () => import('./videoAnalytics/vid/tagHot/Index'),
      },
      {
        path: '/gh/video/retained',
        exact: true,
        component: () => import('./home/vid/retained'),
      },

      {
        path: '/gh/video/top-video/viva',
        exact: true,
        component: () => import('./videoAnalytics/viva/topVideo/Index'),
      },
      {
        path: '/gh/video/hash-tag/viva',
        exact: true,
        component: () => import('./videoAnalytics/viva/hashTag/Index'),
      },
      {
        path: '/gh/video/tag-detail/viva',
        exact: true,
        component: () => import('./videoAnalytics/viva/tagDetail/Index'),
      },
      {
        path: '/gh/video/hot-video-summary/viva',
        exact: true,
        component: () => import('./videoAnalytics/viva/hotVideo/Index'),
      },
      {
        path: '/gh/video/video-hot-rec-pool/viva',
        exact: true,
        component: () => import('./videoAnalytics/viva/videoHotRecPool/Index'),
      },
      {
        path: '/gh/recommendation/main-rec/viva',
        exact: true,
        component: () => import('./recommendation/viva/mainRec/Index'),
      },
      {
        path: '/gh/client-source-analytics/viva',
        exact: true,
        component: () => import('./sourceAnalysis/viva/ClientIndex'),
      },
      {
        path: '/gh/source-analytics/vid',
        exact: true,
        component: () => import('./sourceAnalysis/vid/index'),
      },
      {
        path: '/gh/client-source-analytics/vivacut',
        exact: true,
        component: () => import('./sourceAnalysis/vivacut/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/vmix',
        exact: true,
        component: () => import('./sourceAnalysis/vmix/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/tempo',
        exact: true,
        component: () => import('./sourceAnalysis/tempo/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/sp',
        exact: true,
        component: () => import('./sourceAnalysis/sp/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/vivamini',
        exact: true,
        component: () => import('./sourceAnalysis/vivamini/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/facee',
        exact: true,
        component: () => import('./sourceAnalysis/facee/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/vivavideoindia',
        exact: true,
        component: () => import('./sourceAnalysis/VivaVideoIndia/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/gocut',
        exact: true,
        component: () => import('./sourceAnalysis/gocut/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/mAst',
        exact: true,
        component: () => import('./sourceAnalysis/mAst/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/picsFox',
        exact: true,
        component: () => import('./sourceAnalysis/picsFox/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/storyBuff',
        exact: true,
        component: () => import('./sourceAnalysis/storyBuff/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/Veffecto',
        exact: true,
        component: () => import('./sourceAnalysis/Veffecto/ClientIndex'),
      },
      {
        path: '/gh/client-source-analytics/multirecorder',
        exact: true,
        component: () => import('./sourceAnalysis/Multirecorder/ClientIndex'),
      },
      {
        path: '/gh/source-analytics/viva',
        exact: true,
        component: () => import('./sourceAnalysis/viva/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/vivacut',
        exact: true,
        component: () => import('./sourceAnalysis/vivacut/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/vmix',
        exact: true,
        component: () => import('./sourceAnalysis/vmix/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/vivamini',
        exact: true,
        component: () => import('./sourceAnalysis/vivamini/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/sp',
        exact: true,
        component: () => import('./sourceAnalysis/sp/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/tempo',
        exact: true,
        component: () => import('./sourceAnalysis/tempo/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/facee',
        exact: true,
        component: () => import('./sourceAnalysis/facee/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/gocut',
        exact: true,
        component: () => import('./sourceAnalysis/gocut/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/mAst',
        exact: true,
        component: () => import('./sourceAnalysis/mAst/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/picsFox',
        exact: true,
        component: () => import('./sourceAnalysis/picsFox/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/storyBuff',
        exact: true,
        component: () => import('./sourceAnalysis/storyBuff/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/Veffecto',
        exact: true,
        component: () => import('./sourceAnalysis/Veffecto/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/vivavideoindia',
        exact: true,
        component: () => import('./sourceAnalysis/VivaVideoIndia/ServiceIndex'),
      },
      {
        path: '/gh/source-analytics/multirecorder',
        exact: true,
        component: () => import('./sourceAnalysis/Multirecorder/ServiceIndex'),
      },
      {
        path: '/gh/attribute-active/viva',
        exact: true,
        component: () => import('./attributeActive/viva/Index'),
      },
      {
        path: '/gh/attribute-active/vivacut',
        exact: true,
        component: () => import('./attributeActive/vivacut/Index'),
      },
      {
        path: '/gh/attribute-active/vmix',
        exact: true,
        component: () => import('./attributeActive/vmix/Index'),
      },
      {
        path: '/gh/attribute-active/vivamini',
        exact: true,
        component: () => import('./attributeActive/vivamini/Index'),
      },
      {
        path: '/gh/attribute-active/tempo',
        exact: true,
        component: () => import('./attributeActive/tempo/Index'),
      },
      {
        path: '/gh/attribute-active/sp',
        exact: true,
        component: () => import('./attributeActive/sp/Index'),
      },
      {
        path: '/gh/attribute-active/facee',
        exact: true,
        component: () => import('./attributeActive/facee/Index'),
      },
      {
        path: '/gh/attribute-active/gocut',
        exact: true,
        component: () => import('./attributeActive/gocut/Index'),
      },
      {
        path: '/gh/attribute-active/mAst',
        exact: true,
        component: () => import('./attributeActive/mAst/Index'),
      },
      {
        path: '/gh/attribute-active/PicsFox',
        exact: true,
        component: () => import('./attributeActive/PicsFox/Index'),
      },
      {
        path: '/gh/attribute-active/storyBuff',
        exact: true,
        component: () => import('./attributeActive/storyBuff/Index'),
      },
      {
        path: '/gh/attribute-active/Veffecto',
        exact: true,
        component: () => import('./attributeActive/Veffecto/Index'),
      },
      {
        path: '/gh/attribute-active/Veffecto',
        exact: true,
        component: () => import('./attributeActive/Veffecto/Index'),
      },
      {
        path: '/gh/attribute-active/vivavideoindia',
        exact: true,
        component: () => import('./attributeActive/VivaIndia/Index'),
      },
      {
        path: '/gh/attribute-active/multirecorder',
        exact: true,
        component: () => import('./attributeActive/Multirecorder/Index'),
      },
      {
        path: '/gh/core/performance/apiAnalysis/viva',
        exact: true,
        component: () => import('./coreMonitore/performanceApiAnalysis/viva/Index'),
      },
      {
        path: '/gh/core/api-monitore',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/viva'),
      },
      {
        path: '/gh/core/api-monitore/test',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/viva/testIndex'),
      },
      {
        path: '/gh/core/api-monitore/vid',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/vid'),
      },
      {
        path: '/gh/core/api-monitore/tempo',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/tempo'),
      },
      {
        path: '/gh/core/api-monitore/sp',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/sp'),
      },
      {
        path: '/gh/core/api-monitore/vivacut',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/vivacut'),
      },
      {
        path: '/gh/core/api-monitore/vivamini',
        exact: true,
        component: () => import('./coreMonitore/apiMonitore/vivamini'),
      },
      {
        path: '/gh/core/consuming-monitor/:product',
        exact: true,
        component: () => import('./coreMonitore/consumingMonitor'),
      },
      {
        path: '/gh/money/data-overview',
        exact: true,
        component: () => import('./business/dataOverview/index'),
      },
      {
        path: '/gh/money/pay_funnel/viva',
        exact: true,
        component: () => import('./money/funnelPay/viva/Index'),
      },
      {
        path: '/gh/money/sign_import/viva',
        exact: true,
        component: () => import('./money/signImport/viva/Index'),
      },
      {
        path: '/gh/business/coin_review',
        exact: true,
        component: () => import('./business/coinReview/Index'),
      },
      {
        path: '/gh/business/put_crawler',
        exact: true,
        component: () => import('./business/putCrawler/Index'),
      },
      {
        path: '/gh/business/put_crawler_new',
        exact: true,
        component: () => import('./business/putCrawlerNew/Index'),
      },
      {
        path: '/gh/business/subscribe_transformed_data',
        exact: true,
        component: () => import('./business/subscribeTransformedData'),
      },
      {
        path: '/gh/business/new_income_source/viva',
        exact: true,
        component: () => import('./business/newIncomeSource/viva/Index'),
      },
      {
        path: '/gh/money/VIP_lost/viva',
        exact: true,
        component: () => import('./money/VIPLost/viva/Index'),
      },
      {
        path: '/gh/real-time/viva',
        exact: true,
        component: () => import('./realTimeMonitoring/viva/Index'),
      },
      {
        path: '/gh/path-analysis/template/sp',
        exact: true,
        component: () => import('./pathAnalytics/template/sp/Index'),
      },

      {
        path: '/gh/path-analysis/export/sp',
        exact: true,
        component: () => import('./pathAnalytics/export/sp/Index'),
      },
      {
        path: '/gh/path-analysis/pay/sp',
        exact: true,
        component: () => import('./pathAnalytics/pay/sp/Index'),
      },
      {
        path: '/gh/path-analysis/template/tempo',
        exact: true,
        component: () => import('./pathAnalytics/template/tempo/Index'),
      },
      {
        path: '/gh/path-edit/gocut',
        exact: true,
        component: () => import('./pathEdit/gocut'),
      },
      {
        path: '/gh/path-analysis/pay/tempo',
        exact: true,
        component: () => import('./pathAnalytics/pay/tempo/Index'),
      },
      {
        path: '/gh/path-analysis/pay/gocut',
        exact: true,
        component: () => import('./pathAnalytics/pay/gocut/Index'),
      },
      {
        path: '/gh/path-analysis/make/gocut',
        exact: true,
        component: () => import('./pathAnalytics/make/gocut/Index'),
      },
      {
        path: '/gh/path-analysis/pay/vivacut',
        exact: true,
        component: () => import('./pathAnalytics/pay/vivacut/Index'),
      },
      {
        path: '/gh/path-analysis/pay/facee',
        exact: true,
        component: () => import('./pathAnalytics/pay/facee/Index'),
      },
      // {
      //   path: '/gh/financial/order',
      //   component: () => import('./financial/order/Index'),
      // },
      {
        path: '/gh/financial/income',
        component: () => import('./financial/income/Index'),
      },
      {
        path: '/gh/financial/amortization',
        component: () => import('./financial/amortization/Index'),
      },
      {
        path: '/gh/financial/sale-amortization',
        component: () => import('./financial/saleAmortization'),
      },
      {
        path: '/gh/financial/sale-refund',
        component: () => import('./financial/saleRefund'),
      },
      {
        path: '/gh/financial/check',
        component: () => import('./financial/incomeCheck/index'),
      },
      {
        path: '/gh/financial/put-summary',
        component: () => import('./financial/putSummary'),
      },
      {
        path: '/gh/business/sales-revenue',
        component: () => import('./business/salesRevenue/Index'),
      },
      {
        path: '/gh/business/subscription',
        component: () => import('./business/subscription/index'),
      },
      {
        path: '/gh/core/business-monitore/:product',
        exact: true,
        component: () => import('./coreMonitore/business/View'),
      },
      {
        path: '/gh/core/business-monitore',
        exact: true,
        component: () => import('./coreMonitore/business/View'),
      },
      // {
      //   path: '/gh/core/business-monitore/vid',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      // {
      //   path: '/gh/core/business-monitore/tempo',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      // {
      //   path: '/gh/core/business-monitore/sp',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      // {
      //   path: '/gh/core/business-monitore/vivacut',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      // {
      //   path: '/gh/core/business-monitore/vivamini',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      // {
      //   path: '/gh/core/business-monitore/picslab',
      //   exact: true,
      //   component: () => import('./coreMonitore/business/View'),
      // },
      {
        path: '/gh/core/indicators-monitor/viva',
        component: () => import('./coreMonitore/indicatorsMonitor/index'),
      },
      {
        path: '/gh/business/pay',
        component: () => import('./business/pay/Index'),
      },
      {
        path: '/gh/business/new-user-pay',
        component: () => import('./business/newUserPay/Index'),
      },
      {
        path: '/gh/business/use-conversion',
        component: () => import('./business/trialConvertion/Index'),
      },
      {
        path: '/gh/business/ltv-report',
        component: () => import('./business/ltvReport/index'),
      },
      {
        path: '/gh/business/unit-price',
        component: () => import('./business/unitPrice/Index'),
      },
      {
        path: '/gh/business/refund',
        component: () => import('./business/refund/Index'),
      },
      {
        path: '/gh/business/adv-statistic',
        component: () => import('./business/advStatistics/Index'),
      },
      {
        path: '/gh/business/adv-ltv',
        component: () => import('./business/advLTV/index'),
      },
      {
        path: '/gh/dev_tool/event/:product',
        component: () => import('./devTool/event/Index'),
        models: () => [import('./devTool/event/models')],
      },
      {
        path: '/gh/dev_tool/page_config/:product',
        component: () => import('./devTool/pageConfig/Index'),
        models: () => [import('./devTool/pageConfig/models')],
      },
      {
        path: '/gh/dev_tool/app_developer/:product',
        component: () => import('./devTool/appDeveloper/Index'),
        models: () => [import('./devTool/appDeveloper/models')],
      },
      {
        path: '/gh/business-forecast/summary',
        component: () => import('./businessForecast/summary'),
      },
      {
        path: '/gh/business-forecast/put',
        component: () => import('./businessForecast/put'),
      },
      {
        path: '/gh/business-forecast/config',
        component: () => import('./businessForecast/config'),
      },
      {
        path: '/gh/warning-management/:product',
        component: () => import('./warningManagement'),
      },
      {
        path: '/gh/warning-business',
        component: () => import('./warningBusiness'),
      },
      {
        path: '/gh/okr/vid/crawlerdb/summary',
        exact: true,
        component: () => import('./okr/vid/crawlerdb/summary'),
      },
      {
        path: '/gh/okr/vid/crawlerdb/detail',
        exact: true,
        component: () => import('./okr/vid/crawlerdb/detail'),
      },
      {
        path: '/gh/chart/config',
        exact: true,
        component: () => import('./chartConfig'),
      },
      {
        path: '/gh/issue-system',
        exact: true,
        component: () => import('./issueSystem/Data'),
      },
      {
        path: '/gh/picslab/all-template-path',
        exact: true,
        component: () => import('./picslab/allTemplatePath'),
      },
      {
        path: '/gh/picslab/subdivide-template-path',
        exact: true,
        component: () => import('./picslab/subdivideTemplatePath'),
      },
      {
        path: '/gh/picslab/pay',
        exact: true,
        component: () => import('./picslab/pay'),
      },
      {
        path: '/gh/qvcdm',
        exact: true,
        component: () => import('./qvcdm'),
      },
      {
        path: '/gh/vid/put/source-analysis',
        exact: true,
        component: () => import('./put/source-analysis/Index'),
      },
      {
        path: '/gh/vid/put/put-chart',
        exact: true,
        component: () => import('./put/release-report/Index'),
      },
      {
        path: '/gh/share-trace/vid',
        exact: true,
        component: () => import('./shareTrace/Index'),
      },
      {
        path: '/gh/okr-subscribe/vid',
        exact: true,
        component: () => import('./okr/vid/subscribe/Index'),
      },
      {
        path: '/gh/okr-sub-source/vid',
        exact: true,
        component: () => import('./okr/vid/subSource/Index'),
      },
      {
        path: '/gh/operations/mau',
        exact: true,
        component: () => import('./operations/mau'),
      },
      {
        path: '/gh/operations/apimonitore',
        exact: true,
        component: () => import('./operations/apimonitore'),
      },
      {
        path: '/gh/template-analysis/vivacut',
        exact: true,
        component: () => import('./templateAnalysis/vivacut'),
      },
      {
        path: '/gh/template-analysis/gocut',
        exact: true,
        component: () => import('./templateAnalysis/gocut'),
      },
      {
        path: '/gh/assets-overview/mast',
        exact: true,
        component: () => import('./templateAnalysis/mast'),
      },
      // 运维
      {
        path: '/gh/analytics/action/mast',
        exact: true,
        component: () => import('./analytics/action/mAst/Index'),
      },
      // 产品管理
      {
        path: '/gh/product/manage',
        exact: true,
        component: () => import('./product'),
      },
      {
        path: '/gh/product/line',
        exact: true,
        component: () => import('./product/productLine'),
      },
      {
        path: '/gh/product/employee',
        exact: true,
        component: () => import('./product/employee'),
      },
      {
        path: '/gh/pub-monitor',
        exact: true,
        component: () => import('./pubMonitor'),
      },
      {
        path: '/gh/business/ad-template-data',
        exact: true,
        component: () => import('./business/adTemplateData'),
      },
      {
        path: '/gh/okr-hour/mast',
        exact: true,
        component: () => import('./okr/mast/hourCore/Index'),
      },
      {
        path: '/gh/business/adv-business-data-analysis',
        component: () => import('./business/advBusinessDataAnalysis/Index'),
      },
      {
        path: '/gh/event_task/task_list',
        exact: true,
        component: () => import('./eventTask/TaskList'),
      },
      {
        path: '/gh/event_task/employee',
        exact: true,
        component: () => import('./eventTask/Employee'),
      },
      {
        path: '/gh/event_task/task_detail/:taskId',
        component: () => import('./devTool/event/TaskDetail'),
        models: () => [import('./devTool/event/models')],
      },
      {
        path: '/gh/event_task/task_result/:taskId',
        component: () => import('./event/EventTaskResult'),
      },
      {
        path: '/gh/event_task/task_params_setting',
        component: () => import('./eventTask/ParamsSetting'),
      },
      {
        path: '/gh/event_task/event_alarm',
        component: () => import('./eventTask/EventAlarm'),
      },
      {
        path: '/gh/business/arpu-week',
        component: () => import('./business/arpuWeek/Index'),
      },
      {
        path: '/gh/business/arpu-month',
        component: () => import('./business/arpu/Index'),
      },
      {
        path: '/gh/core-business-data/template-summary-data',
        component: () => import('./coreBusinessData/templateSummaryData/Index'),
      },
      {
        path: '/gh/core-business-data/user-quality-data',
        component: () => import('./coreBusinessData/userQualityData/Index'),
      },
      {
        path: '/gh/custom-country-group',
        component: () => import('./customCountryGroup/Index'),
      },
      {
        path: '/gh/spend-verification/info/:uuid',
        component: () => import('./spendVerification/Info'),
      },
      {
        path: '/gh/spend-verification/check/:uuid',
        component: () => import('./spendVerification/Check'),
      },
      {
        path: '/gh/spend-verification',
        component: () => import('./spendVerification/Index'),
      },
      {
        path: '/gh/income-verification/info/:uuid',
        component: () => import('./incomeVerification/Info'),
      },
      {
        path: '/gh/income-verification/check/:uuid',
        component: () => import('./incomeVerification/Check'),
      },
      {
        path: '/gh/income-verification',
        component: () => import('./incomeVerification/Index'),
      },
    ],
  },
];
