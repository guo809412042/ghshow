CREATE TABLE `gh_event_manage_module_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` int(2) NOT NULL DEFAULT '1' COMMENT '1 页面 2 模块 3 控件 4 行为',
  `module_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `module_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'key',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统计事件模块管理';


CREATE TABLE `gh_custom_country_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `country_codes` text NOT NULL COMMENT '国家代码',
  `group_name` varchar(128) DEFAULT NULL COMMENT '分组名称',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `c_user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '创建者id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='国家自定义分组关系表';