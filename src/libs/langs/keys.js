export default [
  // app shell labels
  'english',
  'turkish',
  'chinese',
  'french',
  'arabic',
  'signout',

  // project keys
  'capital_maps',
  'capital_datasets',
  'capital_foundation',
  'capital_servers',
  'capital_indices',
  'capital_charts',
  'capital_infrastructures',
  'capital_search',

  'view_details',
  'edit_map',
  'delete',
  'set_layers_group',
  'set_theme',
  'active_map',
  'inactive_map',
  'created',

  'extent',
  'enable_data_updates',
  'disable_data_updates',
  'select_theme',
  'hide_live_trafic',
  'show_live_trafic',
  'clear_directions',
  'base_layers',
  'layers',
  'right_of_way',

  'categories',
  'all_visible',
  'filter_categories',
  'search_categories',
  'zoom_to_layer',
  'set_opacity',
  'set_visible',
  'description',
  'layer_name',
  'feature_attribute',
  'map',
  'server',
  'wfs_name',
  'wfs_uri',
  'actions',
  'see_layer_on_map',
  'opacity',
  'visibility',
  'legend',
  'no_legend_found',

  'discard_changes',
  'map_builder',
  'save_exit',
  'publish',
  'search_area',

  'map_details',
  'server_details',
  'map_layers',
  'review',

  'name',
  'crs',
  'min_zoom',
  'max_zoom',
  'min_long',
  'max_long',
  'min_lat',
  'max_lat',
  'next',
  'required_map_name',

  'map_server_link',
  'add_server',
  'server_name',
  'wms_URL',
  'no_servers_found',
  'back',
  'save',
  'discard',
  'server_name',
  'wfs_URL',
  'required_WFS_URL!',
  'required_server_name',
  'required_WMS_URL!',
  'attributes',
  'proxy_URL',
  'disable_server_warning',
  'select_server_to_proceed',
  'groups',
  'themes',
  'retrieve_error',
  'layer_not_deleted',
  'layer_deleted_successfully',
  'something_went_wrong',
  'filter_by_server',
  'filter_by_map',
  'reset',
  'apply',
  'map_layers',
  'search_layers',
  'new_layer',
  'edit',
  'edit_and_duplicate',
  'delete_layer_msg',
  'label',
  'name',
  'featureType',
  'mapName',
  'serverName',
  'actions',
  'no_map_layers_found',
  'fetching_map_layers',
  'groups',
  'themes',
  'map_layer_groups',
  'new_group',
  'deleting_group',
  'group_deleted_succesfully',
  'group_not_deleted',
  'delete_group_msg',
  'fetching_map_layer_groups',
  'no_map_layer_groups_found',
  'map_themes',
  'new_theme',
  'deleting_theme',
  'theme_deleted_succesfully',
  'theme_not_deleted',
  'delete_theme_msg',
  'fetching_map_themes',
  'no_map_themes_found',
  'filter_layers',
  'fetching_info',
  'saving_layer',
  'layer_saved_successfully',
  'error_ocurred_while_fetching_layer',

  'upload_dxf_file',
  'upload_kroki',
  'draw_on_map',
  'input_coordinate',
  'upload_file',
  'upload_image',
  'areas_details',
  'delete_area',
  'show_area_on_map',
  'coordinate_system',
  'northing',
  'easting',
  'actions',
  'no_data',
  'add_new_coordinate',
  'edit',
  'delete',
  'yes',
  'no',
  'validate',
  'validating_areas_details',
  'validation_results',
  'result_options',
  'approved',
  'intersection',
  'export_results',
  'select_file',
  'select_image',
  'layer_icon_here',
  'dxf_file_here',
  'kroki_image_here',
  'select_coord_system',
  'draw_shape_on_map',
  'reupload_image',
  'right_of_way',
  'land_investment',
  'nursery_permit',

  'no_area_found',
  'loading_info',
  'loading_map',
  'loading_app',
  'loading_layer_data',
  'input_area_details',

  'select_map_layers',
  'search_layers',
  'server_name',
  'select_all',

  'select_base_layers',
  'no_base_layers_found',
  'base_layer_name',
  'layer_type',
  'url',

  'public',
  'anyone_can_see_map',
  'invite_only',
  'only_members_can_see_map',

  'set_bounds',
  'share_via_email',
  'share_map_with',
  'email',
  'publish',
  'step',
  'area_radius',

  'gis_product',
  'studio',
  'select_workspaces',
  'create_map',
  'view_dashboard',

  'map_image_here',
  'map_image',
  'layers_order',
  'no_layer_found',
  'fetching_maps',
  'default_theme',
  'reupload_file',
  'area',
  'buildings',
  'schools',
  'hospitals',
  'pipelines',
  'intrastructure',
  'inf_description',
  'population',
  'view_in_3d',
  'change_radius',
].reduce((r, i) => {
  r[i] = i
  return r
}, {})
