/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/13
 * Time: 下午5:43
 *
 */
import Cookie from 'js-cookie';

const lang = Cookie.get('lang') !== 'en-US';

export const ProportionOfCommunityUsers = lang ? '社区用户占比' : 'Proportion Of Community Users';
export const ProportionOfConsumers = lang ? '消费用户占比' : 'Proportion Of Consumers';
export const ProportionOfProducer = lang ? '发布用户占比' : 'Proportion Of Producer';
export const ProportionOfToolUsers = lang ? '工具用户占比' : 'Proportion Of Tool Users';
export const ProportionOfVideoMakers = lang ? '创作用户占比' : 'Proportion Of Video Makers';
export const ExploreViewRate = lang ? '发现页播放率' : 'Explore View Rate';
export const ExploreEnterRate = lang ? '发现页进入率' : 'Explore Enter Rate';
export const HotViewRate = lang ? '热门页播放率' : 'Hot View Ratee';
export const HotEnterRate = lang ? '热门页进入率' : 'Hot Enter Rate';
export const AverageViewsPerUser = lang ? '用户平均观看视频数' : 'Average Views Per User';
export const ViewersCommunityUsers = lang ? '消费用户占社区用户比例' : 'viewers/community users';
export const AverageViewsPerVideo = lang ? '平均视频播放数' : 'Average Views Per Video';
export const AveragePlayPerUser = lang ? '人均播放时长' : 'Average Play Per User';
export const DurationPlayPerUser = lang ? '有效播放时长' : 'Duration Play Per User';
export const VivaVideoAndroid = lang ? '小影 Android' : 'VivaVideo Android';
export const VivaVideoIOS = lang ? '小影 ios' : 'VivaVideo ios';
export const All = lang ? '全部' : 'All';
export const NewAndActiveUsers = lang ? '新增和活跃用户' : 'New And Active Users';
export const CommunityActivity = lang ? '社区互动数据变化' : 'Community Activity';
export const PercentageOfLikeComment = lang ? '社区用户中点赞评论占比' : 'Percentage Of Like & Comment';
export const NewUsers = lang ? '新增用户' : 'New Users';
export const RegisteredUsers = lang ? '登录用户' : 'Registered Users';
export const CommunityUsers = lang ? '社区用户' : 'Community Users';
export const Consumers = lang ? '消费用户' : 'Consumers';
export const Producer = lang ? '发布用户' : 'Producer';
export const ToolUser = lang ? '工具用户' : 'Tool User';
export const VideoMaker = lang ? '创作用户' : 'Video Maker';
export const LikeCount = lang ? '喜欢总数' : 'Like';
export const ShareCount = lang ? '转发总数' : 'Share';
export const CommentCount = lang ? '评论总数' : 'Comment';
export const CountOfDownload = lang ? '下载总数' : 'Count Of Download';
export const UvOfLike = lang ? '点赞 uv' : 'Uv Of Like';
export const UvOfShare = lang ? '转发 uv' : 'Uv Of Share';
export const UvOfComment = lang ? '评论 uv' : 'Uv Of Comment';
export const UvOfDownload = lang ? '下载 uv' : 'Uv Of Download';
export const ViewsRetention = lang ? '播放留存' : 'Views Retention';
export const CommunityRetention = lang ? '社区留存' : 'Community Retention';
export const Like = lang ? '点赞' : 'Like';
export const View = lang ? '播放数' : 'View';
export const Comment = lang ? '评论' : 'Comment';
export const UvOfView = lang ? '播放uv' : 'Uv Of View';
export const VideoViews = lang ? '视频播放分布' : 'Video Views';
export const InAppView = lang ? '站内播放' : 'In-App View (>=3s)';
export const WebView = lang ? '站外播放' : 'Web View';
export const TotalView = lang ? '播放总量' : 'Total View';
export const WebVideoViews = lang ? '站外视频播放' : 'Web Video Views';
export const Weibo = lang ? '新浪微博' : 'Weibo';
export const Links = lang ? '小影' : 'Links';
export const WechatMoments = lang ? '微信朋友圈' : 'Wechat Moments';
export const Wechat = lang ? '微信好友' : 'Wechat';
export const Qzone = lang ? 'QQ空间' : 'Qzone';
export const QQ = lang ? 'QQ好友/QQ群' : 'QQ';
export const VvUv = lang ? 'vv/uv 人均播放' : 'Vv&Uv';
export const UsersConnection = lang ? '用户关系' : 'Users Connection';
export const AverageFollowing = lang ? '人均关注数' : 'Average Following';
export const AverageFans = lang ? '人均粉丝数' : 'Average Fans';
export const RefollowFollow = lang ? '互粉／关注数' : 'Refollow/Follow';
export const VideoMakerToolUsers = lang ? '创作用户占工具用户比' : 'Video Maker/Tool Users';
export const ProducerVideoMakers = lang ? '发布用户占创作用户比' : 'Producer/Video Makers';
export const PercentageOfRegisteredUsers = lang ? '登录用户占比' : 'Percentage Of Registered Users';
export const AverageVideosPublishedPerProducer = lang ? '人均发布视频数' : 'Average Videos Published Per Producer';
export const VideoViewsPerUser = lang ? '人均播放视频数' : 'Video Views Per User';
export const AvgVideoExposuresPerUser = lang ? '人均曝光数' : 'Avg. Video Exposures Per User';
export const AvgEffectiveWatchLengthPerUserMS = lang
  ? '有效人均播放时长（ms）'
  : 'Avg. Effective Watch Length Per User (ms)';
export const AvgVideoRequestPerUser = lang ? '人均请求数' : 'Avg. Video Request Per User';
export const AvgVideoLikePerUser = lang ? '人均点赞' : 'Avg. Video Like Per User';
export const AvgVideoDownloadPerUser = lang ? '人均下载' : 'Avg. Video Download Per User';
export const AvgCommentPerUser = lang ? '人均评论' : 'Avg. Comment Per User';
export const AvgForwardPerUser = lang ? '人均转发' : 'Avg. Forward Per User';
export const RetentionForNewUser = lang ? '次留(%)' : 'Retention For New User';
export const TypicalUsers = lang ? '各分类用户' : 'Typical Users';
export const HierarchyForConsumeUser = lang ? '播放用户分层' : 'Hierarchy For Consume User';
export const VideoConsumptionLayer = lang ? '消费用户分层' : 'Video Consumption Layer';
export const HierarchyForCreator = lang ? '创作用户分层' : 'Hierarchy For Creator';
export const CreatorData = lang ? '发布数据' : 'Creator Data';
export const CommunityData = lang ? '互动数据' : 'Community Data';
export const UserFollowData = lang ? '关注数据' : 'User Follow Data';
export const UsersReports = lang ? '用户分析' : 'Users Reports';
