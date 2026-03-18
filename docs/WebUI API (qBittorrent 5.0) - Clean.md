# WebUI API (qBittorrent 5.0)[Jump to bottom](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#wiki-pages-box)xavier2k6 edited this page2 weeks agoJan 22, 2026·[5 revisions](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)/_history)
This WebUI API documentation applies to qBittorrent v5.0+. For other WebUI API versions, visit[WebUI API](https://github.com/qbittorrent/qBittorrent/wiki#WebUI-API).

# Table of Contents[
1. [Changes](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#changes)
  2. [API v2.9.3](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#api-v293)
  3. [API v2.11.3](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#api-v2113)
1. [General information](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#general-information)
2. [Authentication](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#authentication)
  3. [Login](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#login)
  4. [Logout](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#logout)
1. [Application](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#application)
  2. [Get application version](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-application-version)
  3. [Get API version](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-api-version)
  4. [Get build info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-build-info)
  5. [Shutdown application](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#shutdown-application)
  6. [Get application preferences](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-application-preferences)
  7. [Set application preferences](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-application-preferences)
  8. [Get default save path](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-default-save-path)
  9. [Get cookies](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-cookies)
  10. [Set cookies](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-cookies)
1. [Log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#log)
  2. [Get log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-log)
  3. [Get peer log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-peer-log)
1. [Sync](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#sync)
  2. [Get main data](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-main-data)
  3. [Get torrent peers data](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-peers-data)
1. [Transfer info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#transfer-info)
  2. [Get global transfer info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-transfer-info)
  3. [Get alternative speed limits state](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-alternative-speed-limits-state)
  4. [Toggle alternative speed limits](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#toggle-alternative-speed-limits)
  5. [Get global download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-download-limit)
  6. [Set global download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-global-download-limit)
  7. [Get global upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-upload-limit)
  8. [Set global upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-global-upload-limit)
  9. [Ban peers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#ban-peers)
1. [Torrent management](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#torrent-management)
  2. [Get torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list)
  3. [Get torrent generic properties](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-generic-properties)
  4. [Get torrent trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-trackers)
  5. [Get torrent web seeds](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-web-seeds)
  6. [Get torrent contents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents)
  7. [Get torrent pieces' states](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-pieces-states)
  8. [Get torrent pieces' hashes](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-pieces-hashes)
  9. [Pause torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#pause-torrents)
  10. [Resume torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#resume-torrents)
  11. [Delete torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-torrents)
  12. [Recheck torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#recheck-torrents)
  13. [Reannounce torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#reannounce-torrents)
  14. [Edit trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#edit-trackers)
  15. [Remove trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-trackers)
  16. [Add peers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-peers)
  17. [Add new torrent](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-new-torrent)
  18. [Add trackers to torrent](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-trackers-to-torrent)
  19. [Increase torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#increase-torrent-priority)
  20. [Decrease torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#decrease-torrent-priority)
  21. [Maximal torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#maximal-torrent-priority)
  22. [Minimal torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#minimal-torrent-priority)
  23. [Set file priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-file-priority)
  24. [Get torrent download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-download-limit)
  25. [Set torrent download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-download-limit)
  26. [Set torrent share limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-share-limit)
  27. [Get torrent upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-upload-limit)
  28. [Set torrent upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-upload-limit)
  29. [Set torrent location](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-location)
  30. [Set torrent name](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-name)
  31. [Set torrent category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-category)
  32. [Get all categories](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-categories)
  33. [Add new category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-new-category)
  34. [Edit category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#edit-category)
  35. [Remove categories](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-categories)
  36. [Add torrent tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-torrent-tags)
  37. [Remove torrent tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-torrent-tags)
  38. [Get all tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-tags)
  39. [Create tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#create-tags)
  40. [Delete tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-tags)
  41. [Set automatic torrent management](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-automatic-torrent-management)
  42. [Toggle sequential download](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#toggle-sequential-download)
  43. [Set first/last piece priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-firstlast-piece-priority)
  44. [Set force start](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-force-start)
  45. [Set super seeding](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-super-seeding)
  46. [Rename file](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-file)
  47. [Rename folder](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-folder)
1. [RSS (experimental)](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rss-experimental)
  2. [Add folder](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-folder)
  3. [Add feed](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-feed)
  4. [Remove item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-item)
  5. [Move item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#move-item)
  6. [Get all items](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-items)
  7. [Mark as read](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#mark-as-read)
  8. [Refresh item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#refresh-item)
  9. [Set auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-auto-downloading-rule)
  10. [Rename auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-auto-downloading-rule)
  11. [Remove auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-auto-downloading-rule)
  12. [Get all auto-downloading rules](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-auto-downloading-rules)
  13. [Get all articles matching a rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-articles-matching-a-rule)
1. [Search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#search)
  2. [Start search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#start-search)
  3. [Stop search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#stop-search)
  4. [Get search status](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-status)
  5. [Get search results](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-results)
  6. [Delete search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-search)
  7. [Get search plugins](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-plugins)
  8. [Install search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#install-search-plugin)
  9. [Uninstall search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#uninstall-search-plugin)
  10. [Enable search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#enable-search-plugin)
  11. [Update search plugins](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#update-search-plugins)
1. [WebAPI versioning](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#webapi-versioning)
---

# Changes[
## API v2.9.3[
- Added`reannounce`to`/torrents/info`([#19571](https://github.com/qbittorrent/qBittorrent/pull/19571))
## API v2.11.3[
- Add APIs for managing cookies` ([#21340](https://github.com/qbittorrent/qBittorrent/pull/21340))
- Remove`cookie`field from`/torrents/add`request
# General Information[
- All API methods follows the format`/api/v2/APIName/methodName`, where`APIName`is a certain subgroup of API methods whose functionality is related.
- All API methods only allows`GET`or`POST`methods. Use`POST`when you are mutating some state (or when your request is too big to fit into`GET`) and use`GET`otherwise. Starting with qBittorrent v4.4.4, server will return`405 Method Not Allowed`when you used the wrong request method.
- All API methods require[authentication](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#authentication)(except`/api/v2/auth/login`, obviously).
# Authentication[
All Authentication API methods are under "auth", e.g.:`/api/v2/auth/methodName`.
qBittorrent uses cookie-based authentication.

## Login[
Name:`login`
**Parameters:**
`username``password`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Username used to access the WebUI |  |
| string | Password used to access the WebUI |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 403 | User's IP is banned for too many failed login attempts |
| 200 | All other scenarios |

Upon success, the response will contain a cookie with your SID. You must supply the cookie whenever you want to perform an operation that requires authentication.
Example showing how to login and execute a command that requires authentication using`curl`:

```
$ curl -i --header 'Referer: http://localhost:8080' --data 'username=admin&password=adminadmin' http://localhost:8080/api/v2/auth/login
HTTP/1.1 200 OK
Content-Encoding:
Content-Length: 3
Content-Type: text/plain; charset=UTF-8
Set-Cookie: SID=hBc7TxF76ERhvIw0jQQ4LZ7Z1jQUV0tQ; path=/
$ curl http://localhost:8080/api/v2/torrents/info --cookie "SID=hBc7TxF76ERhvIw0jQQ4LZ7Z1jQUV0tQ"
```

Note: Set`Referer`or`Origin`header to the exact same domain and port as used in the HTTP query`Host`header.

## Logout[
Name:`logout`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


# Application[
All Application API methods are under "app", e.g.:`/api/v2/app/methodName`.

## Get application version[
Name:`version`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is a string with the application version, e.g.`v4.1.3`

## Get API version[
Name:`webapiVersion`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is a string with the WebAPI version, e.g.`2.0`

## Get build info[
Name:`buildInfo`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON object containing the following fields
`qt``libtorrent``boost``openssl``bitness`
| Property | Type | Description |
| --- | --- | --- |
| string | QT version |  |
| string | libtorrent version |  |
| string | Boost version |  |
| string | OpenSSL version |  |
| int | Application bitness (e.g. 64-bit) |  |


## Shutdown application[
Name:`shutdown`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get application preferences[
Name:`preferences`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON object with several fields (key-value) pairs representing the application's settings. The contents may vary depending on which settings are present in qBittorrent.ini.
Possible fields:
`locale``create_subfolder_enabled``start_paused_enabled``auto_delete_mode``preallocate_all``incomplete_files_ext``auto_tmm_enabled``torrent_changed_tmm_enabled``save_path_changed_tmm_enabled``category_changed_tmm_enabled``save_path``temp_path_enabled``temp_path``scan_dirs``export_dir``export_dir_fin``mail_notification_enabled``mail_notification_sender``mail_notification_email``mail_notification_smtp``mail_notification_ssl_enabled``mail_notification_auth_enabled``mail_notification_username``mail_notification_password``autorun_enabled``autorun_program``autorun_enabled`is enabled; path is separated by slashes; you can use`%f`and`%n`arguments, which will be expanded by qBittorrent as path_to_torrent_file and torrent_name (from the GUI; not the .torrent file name) respectively`queueing_enabled``max_active_downloads``max_active_torrents``max_active_uploads``dont_count_slow_torrents``max_active_*`limits; see[dont_count_slow_torrents](https://www.libtorrent.org/reference-Settings.html#dont_count_slow_torrents)for more information`slow_torrent_dl_rate_threshold``slow_torrent_ul_rate_threshold``slow_torrent_inactive_timer``max_ratio_enabled``max_ratio``max_ratio_act``listen_port``upnp``random_port``dl_limit``-1`means no limit is applied`up_limit``-1`means no limit is applied`max_connec``max_connec_per_torrent``max_uploads``max_uploads_per_torrent``stop_tracker_timeout``stopped`announce request to trackers`enable_piece_extent_affinity``piece_extent_affinity`is enabled`bittorrent_protocol``limit_utp_rate``[du]l_limit`should be applied to uTP connections; this option is only available in qBittorrent built against libtorrent version 0.16.X and higher`limit_tcp_overhead``[du]l_limit`should be applied to estimated TCP overhead (service data: e.g. packet headers)`limit_lan_peers``[du]l_limit`should be applied to peers on the LAN`alt_dl_limit``alt_up_limit``scheduler_enabled``schedule_from_hour``schedule_from_min``schedule_to_hour``schedule_to_min``scheduler_days``dht``pex``lsd``encryption``anonymous_mode`[here](https://github.com/qbittorrent/qBittorrent/wiki/Anonymous-Mode); this option is only available in qBittorrent built against libtorrent version 0.16.X and higher`proxy_type``proxy_ip``proxy_port``proxy_peer_connections``proxy_auth_enabled``proxy_username``proxy_password``proxy_torrents_only``ip_filter_enabled``ip_filter_path``ip_filter_trackers``web_ui_domain_list``web_ui_address``web_ui_port``web_ui_upnp``web_ui_username``web_ui_password``username:Web UI Access:plain_text_web_ui_password``web_ui_csrf_protection_enabled``web_ui_clickjacking_protection_enabled``web_ui_secure_cookie_enabled``Secure`flag is enabled`web_ui_max_auth_fail_count``web_ui_ban_duration``web_ui_session_timeout``web_ui_host_header_validation_enabled``bypass_local_auth``bypass_auth_subnet_whitelist_enabled``bypass_auth_subnet_whitelist``alternative_webui_enabled``alternative_webui_path``use_https``ssl_key``ssl_cert``web_ui_https_key_path``web_ui_https_cert_path``dyndns_enabled``dyndns_service``dyndns_username``dyndns_password``dyndns_domain``rss_refresh_interval``rss_max_articles_per_feed``rss_processing_enabled``rss_auto_downloading_enabled``rss_download_repack_proper_episodes``rss_smart_episode_filters``add_trackers_enabled``add_trackers``web_ui_use_custom_http_headers_enabled``web_ui_custom_http_headers``max_seeding_time_enabled``max_seeding_time``announce_ip``announce_to_all_tiers``announce_to_all_trackers``async_io_threads``banned_IPs``checking_memory_use``current_interface_address``current_network_interface``disk_cache``disk_cache_ttl``embedded_tracker_port``enable_coalesce_read_write``enable_embedded_tracker``enable_multi_connections_from_same_ip``enable_os_cache``enable_upload_suggestions``file_pool_size``outgoing_ports_max``outgoing_ports_min``recheck_completed_torrents``resolve_peer_countries``save_resume_data_interval``send_buffer_low_watermark``send_buffer_watermark``send_buffer_watermark_factor``socket_backlog_size``upload_choking_algorithm``upload_slots_behavior``upnp_lease_duration``utp_tcp_mixed_mode`
| Property | Type | Description |
| --- | --- | --- |
| string | Currently selected language (e.g. en_GB for English) |  |
| bool | True if a subfolder should be created when adding a torrent |  |
| bool | True if torrents should be added in a Paused state |  |
| integer | TODO |  |
| bool | True if disk space should be pre-allocated for all files |  |
| bool | True if ".!qB" should be appended to incomplete files |  |
| bool | True if Automatic Torrent Management is enabled by default |  |
| bool | True if torrent should be relocated when its Category changes |  |
| bool | True if torrent should be relocated when the default save path changes |  |
| bool | True if torrent should be relocated when its Category's save path changes |  |
| string | Default save path for torrents, separated by slashes |  |
| bool | True if folder for incomplete torrents is enabled |  |
| string | Path for incomplete torrents, separated by slashes |  |
| object | Property: directory to watch for torrent files, value: where torrents loaded from this directory should be downloaded to (see list of possible values below). Slashes are used as path separators; multiple key/value pairs can be specified |  |
| string | Path to directory to copy .torrent files to. Slashes are used as path separators |  |
| string | Path to directory to copy .torrent files of completed downloads to. Slashes are used as path separators |  |
| bool | True if e-mail notification should be enabled |  |
| string | e-mail where notifications should originate from |  |
| string | e-mail to send notifications to |  |
| string | smtp server for e-mail notifications |  |
| bool | True if smtp server requires SSL connection |  |
| bool | True if smtp server requires authentication |  |
| string | Username for smtp authentication |  |
| string | Password for smtp authentication |  |
| bool | True if external program should be run after torrent has finished downloading |  |
| string | Program path/name/arguments to run if |  |
| bool | True if torrent queuing is enabled |  |
| integer | Maximum number of active simultaneous downloads |  |
| integer | Maximum number of active simultaneous downloads and uploads |  |
| integer | Maximum number of active simultaneous uploads |  |
| bool | If true torrents w/o any activity (stalled ones) will not be counted towards |  |
| integer | Download rate in KiB/s for a torrent to be considered "slow" |  |
| integer | Upload rate in KiB/s for a torrent to be considered "slow" |  |
| integer | Seconds a torrent should be inactive before considered "slow" |  |
| bool | True if share ratio limit is enabled |  |
| float | Get the global share ratio limit |  |
| integer | Action performed when a torrent reaches the maximum share ratio. See list of possible values here below. |  |
| integer | Port for incoming connections |  |
| bool | True if UPnP/NAT-PMP is enabled |  |
| bool | True if the port is randomly selected |  |
| integer | Global download speed limit in KiB/s; |  |
| integer | Global upload speed limit in KiB/s; |  |
| integer | Maximum global number of simultaneous connections |  |
| integer | Maximum number of simultaneous connections per torrent |  |
| integer | Maximum number of upload slots |  |
| integer | Maximum number of upload slots per torrent |  |
| integer | Timeout in seconds for a |  |
| bool | True if the advanced libtorrent option |  |
| integer | Bittorrent Protocol to use (see list of possible values below) |  |
| bool | True if |  |
| bool | True if |  |
| bool | True if |  |
| integer | Alternative global download speed limit in KiB/s |  |
| integer | Alternative global upload speed limit in KiB/s |  |
| bool | True if alternative limits should be applied according to schedule |  |
| integer | Scheduler starting hour |  |
| integer | Scheduler starting minute |  |
| integer | Scheduler ending hour |  |
| integer | Scheduler ending minute |  |
| integer | Scheduler days. See possible values here below |  |
| bool | True if DHT is enabled |  |
| bool | True if PeX is enabled |  |
| bool | True if LSD is enabled |  |
| integer | See list of possible values here below |  |
| bool | If true anonymous mode will be enabled; read more |  |
| integer | See list of possible values here below |  |
| string | Proxy IP address or domain name |  |
| integer | Proxy port |  |
| bool | True if peer and web seed connections should be proxified; this option will have any effect only in qBittorrent built against libtorrent version 0.16.X and higher |  |
| bool | True proxy requires authentication; doesn't apply to SOCKS4 proxies |  |
| string | Username for proxy authentication |  |
| string | Password for proxy authentication |  |
| bool | True if proxy is only used for torrents |  |
| bool | True if external IP filter should be enabled |  |
| string | Path to IP filter file (.dat, .p2p, .p2b files are supported); path is separated by slashes |  |
| bool | True if IP filters are applied to trackers |  |
| string | Semicolon-separated list of domains to accept when performing Host header validation |  |
| string | IP address to use for the WebUI |  |
| integer | WebUI port |  |
| bool | True if UPnP is used for the WebUI port |  |
| string | WebUI username |  |
| string | For API ≥ v2.3.0: Plaintext WebUI password, not readable, write-only. For API < v2.3.0: MD5 hash of WebUI password, hash is generated from the following string: |  |
| bool | True if WebUI CSRF protection is enabled |  |
| bool | True if WebUI clickjacking protection is enabled |  |
| bool | True if WebUI cookie |  |
| integer | Maximum number of authentication failures before WebUI access ban |  |
| integer | WebUI access ban duration in seconds |  |
| integer | Seconds until WebUI is automatically signed off |  |
| bool | True if WebUI host header validation is enabled |  |
| bool | True if authentication challenge for loopback address (127.0.0.1) should be disabled |  |
| bool | True if webui authentication should be bypassed for clients whose ip resides within (at least) one of the subnets on the whitelist |  |
| string | (White)list of ipv4/ipv6 subnets for which webui authentication should be bypassed; list entries are separated by commas |  |
| bool | True if an alternative WebUI should be used |  |
| string | File path to the alternative WebUI |  |
| bool | True if WebUI HTTPS access is enabled |  |
| string | For API < v2.0.1: SSL keyfile contents (this is a not a path) |  |
| string | For API < v2.0.1: SSL certificate contents (this is a not a path) |  |
| string | For API ≥ v2.0.1: Path to SSL keyfile |  |
| string | For API ≥ v2.0.1: Path to SSL certificate |  |
| bool | True if server DNS should be updated dynamically |  |
| integer | See list of possible values here below |  |
| string | Username for DDNS service |  |
| string | Password for DDNS service |  |
| string | Your DDNS domain name |  |
| integer | RSS refresh interval |  |
| integer | Max stored articles per RSS feed |  |
| bool | Enable processing of RSS feeds |  |
| bool | Enable auto-downloading of torrents from the RSS feeds |  |
| bool | For API ≥ v2.5.1: Enable downloading of repack/proper Episodes |  |
| string | For API ≥ v2.5.1: List of RSS Smart Episode Filters |  |
| bool | Enable automatic adding of trackers to new torrents |  |
| string | List of trackers to add to new torrent |  |
| bool | For API ≥ v2.5.1: Enable custom http headers |  |
| string | For API ≥ v2.5.1: List of custom http headers |  |
| bool | True enables max seeding time |  |
| integer | Number of minutes to seed a torrent |  |
| string | TODO |  |
| bool | True always announce to all tiers |  |
| bool | True always announce to all trackers in a tier |  |
| integer | Number of asynchronous I/O threads |  |
| string | List of banned IPs |  |
| integer | Outstanding memory when checking torrents in MiB |  |
| string | IP Address to bind to. Empty String means All addresses |  |
| string | Network Interface used |  |
| integer | Disk cache used in MiB |  |
| integer | Disk cache expiry interval in seconds |  |
| integer | Port used for embedded tracker |  |
| bool | True enables coalesce reads & writes |  |
| bool | True enables embedded tracker |  |
| bool | True allows multiple connections from the same IP address |  |
| bool | True enables os cache |  |
| bool | True enables sending of upload piece suggestions |  |
| integer | File pool size |  |
| integer | Maximal outgoing port (0: Disabled) |  |
| integer | Minimal outgoing port (0: Disabled) |  |
| bool | True rechecks torrents on completion |  |
| bool | True resolves peer countries |  |
| integer | Save resume data interval in min |  |
| integer | Send buffer low watermark in KiB |  |
| integer | Send buffer watermark in KiB |  |
| integer | Send buffer watermark factor in percent |  |
| integer | Socket backlog size |  |
| integer | Upload choking algorithm used (see list of possible values below) |  |
| integer | Upload slots behavior used (see list of possible values below) |  |
| integer | UPnP lease duration (0: Permanent lease) |  |
| integer | μTP-TCP mixed mode algorithm (see list of possible values below) |  |

Possible values of`scan_dirs`:
`0``1``"/path/to/download/to"`
| Value | Description |
| --- | --- |
| Download to the monitored folder |  |
| Download to the default save path |  |
| Download to this path |  |

Possible values of`scheduler_days`:
`0``1``2``3``4``5``6``7``8``9`
| Value | Description |
| --- | --- |
| Every day |  |
| Every weekday |  |
| Every weekend |  |
| Every Monday |  |
| Every Tuesday |  |
| Every Wednesday |  |
| Every Thursday |  |
| Every Friday |  |
| Every Saturday |  |
| Every Sunday |  |

Possible values of`encryption`:
`0``1``2`
| Value | Description |
| --- | --- |
| Prefer encryption |  |
| Force encryption on |  |
| Force encryption off |  |

NB: the first options allows you to use both encrypted and unencrypted connections (this is the default); other options are mutually exclusive: e.g. by forcing encryption on you won't be able to use unencrypted connections and vice versa.
Possible values of`proxy_type`:
`-1``1``2``3``4``5`
| Value | Description |
| --- | --- |
| Proxy is disabled |  |
| HTTP proxy without authentication |  |
| SOCKS5 proxy without authentication |  |
| HTTP proxy with authentication |  |
| SOCKS5 proxy with authentication |  |
| SOCKS4 proxy without authentication |  |

Possible values of`dyndns_service`:
`0``1`
| Value | Description |
| --- | --- |
| Use DyDNS |  |
| Use NOIP |  |

Possible values of`max_ratio_act`:
`0``1`
| Value | Description |
| --- | --- |
| Pause torrent |  |
| Remove torrent |  |

Possible values of`bittorrent_protocol`:
`0``1``2`
| Value | Description |
| --- | --- |
| TCP and μTP |  |
| TCP |  |
| μTP |  |

Possible values of`upload_choking_algorithm`:
`0``1``2`
| Value | Description |
| --- | --- |
| Round-robin |  |
| Fastest upload |  |
| Anti-leech |  |

Possible values of`upload_slots_behavior`:
`0``1`
| Value | Description |
| --- | --- |
| Fixed slots |  |
| Upload rate based |  |

Possible values of`utp_tcp_mixed_mode`:
`0``1`
| Value | Description |
| --- | --- |
| Prefer TCP |  |
| Peer proportional |  |

Example:

```
{
    "add_trackers": "",
    "add_trackers_enabled": false,
    "alt_dl_limit": 10240,
    "alt_up_limit": 10240,
    "alternative_webui_enabled": false,
    "alternative_webui_path": "/home/user/Documents/qbit-webui",
    "announce_ip": "",
    "announce_to_all_tiers": true,
    "announce_to_all_trackers": false,
    "anonymous_mode": false,
    "async_io_threads": 4,
    "auto_delete_mode": 0,
    "auto_tmm_enabled": false,
    "autorun_enabled": false,
    "autorun_program": "",
    "banned_IPs": "",
    "bittorrent_protocol": 0,
    "bypass_auth_subnet_whitelist": "",
    "bypass_auth_subnet_whitelist_enabled": false,
    "bypass_local_auth": false,
    "category_changed_tmm_enabled": false,
    "checking_memory_use": 32,
    "create_subfolder_enabled": true,
    "current_interface_address": "",
    "current_network_interface": "",
    "dht": true,
    "disk_cache": -1,
    "disk_cache_ttl": 60,
    "dl_limit": 0,
    "dont_count_slow_torrents": false,
    "dyndns_domain": "changeme.dyndns.org",
    "dyndns_enabled": false,
    "dyndns_password": "",
    "dyndns_service": 0,
    "dyndns_username": "",
    "embedded_tracker_port": 9000,
    "enable_coalesce_read_write": false,
    "enable_embedded_tracker": false,
    "enable_multi_connections_from_same_ip": false,
    "enable_os_cache": true,
    "enable_piece_extent_affinity": false,
    "enable_upload_suggestions": false,
    "encryption": 0,
    "export_dir": "/home/user/Downloads/all",
    "export_dir_fin": "/home/user/Downloads/completed",
    "file_pool_size": 40,
    "incomplete_files_ext": false,
    "ip_filter_enabled": false,
    "ip_filter_path": "",
    "ip_filter_trackers": false,
    "limit_lan_peers": true,
    "limit_tcp_overhead": false,
    "limit_utp_rate": true,
    "listen_port": 58925,
    "locale": "en",
    "lsd": true,
    "mail_notification_auth_enabled": false,
    "mail_notification_email": "",
    "mail_notification_enabled": false,
    "mail_notification_password": "",
    "mail_notification_sender": "qBittorrent_notification@example.com",
    "mail_notification_smtp": "smtp.changeme.com",
    "mail_notification_ssl_enabled": false,
    "mail_notification_username": "",
    "max_active_downloads": 3,
    "max_active_torrents": 5,
    "max_active_uploads": 3,
    "max_connec": 500,
    "max_connec_per_torrent": 100,
    "max_ratio": -1,
    "max_ratio_act": 0,
    "max_ratio_enabled": false,
    "max_seeding_time": -1,
    "max_seeding_time_enabled": false,
    "max_uploads": -1,
    "max_uploads_per_torrent": -1,
    "outgoing_ports_max": 0,
    "outgoing_ports_min": 0,
    "pex": true,
    "preallocate_all": false,
    "proxy_auth_enabled": false,
    "proxy_ip": "0.0.0.0",
    "proxy_password": "",
    "proxy_peer_connections": false,
    "proxy_port": 8080,
    "proxy_torrents_only": false,
    "proxy_type": 0,
    "proxy_username": "",
    "queueing_enabled": false,
    "random_port": false,
    "recheck_completed_torrents": false,
    "resolve_peer_countries": true,
    "rss_auto_downloading_enabled":true,
    "rss_download_repack_proper_episodes":true,
    "rss_max_articles_per_feed":50,
    "rss_processing_enabled":true,
    "rss_refresh_interval":30,
    "rss_smart_episode_filters":"s(\\d+)e(\\d+)\n(\\d+)x(\\d+)\n(\\d{4}[.\\-]\\d{1,2}[.\\-]\\d{1,2})",
    "save_path": "/home/user/Downloads/",
    "save_path_changed_tmm_enabled": false,
    "save_resume_data_interval": 60,
    "scan_dirs":
    {
        "/home/user/Downloads/incoming/games": 0,
        "/home/user/Downloads/incoming/movies": 1,
    },
    "schedule_from_hour": 8,
    "schedule_from_min": 0,
    "schedule_to_hour": 20,
    "schedule_to_min": 0,
    "scheduler_days": 0,
    "scheduler_enabled": false,
    "send_buffer_low_watermark": 10,
    "send_buffer_watermark": 500,
    "send_buffer_watermark_factor": 50,
    "slow_torrent_dl_rate_threshold": 2,
    "slow_torrent_inactive_timer": 60,
    "slow_torrent_ul_rate_threshold": 2,
    "socket_backlog_size": 30,
    "start_paused_enabled": false,
    "stop_tracker_timeout": 1,
    "temp_path": "/home/user/Downloads/temp",
    "temp_path_enabled": false,
    "torrent_changed_tmm_enabled": true,
    "up_limit": 0,
    "upload_choking_algorithm": 1,
    "upload_slots_behavior": 0,
    "upnp": true,
    "use_https": false,
    "utp_tcp_mixed_mode": 0,
    "web_ui_address": "*",
    "web_ui_ban_duration": 3600,
    "web_ui_clickjacking_protection_enabled": true,
    "web_ui_csrf_protection_enabled": true,
    "web_ui_custom_http_headers": "",
    "web_ui_domain_list": "*",
    "web_ui_host_header_validation_enabled": true,
    "web_ui_https_cert_path": "",
    "web_ui_https_key_path": "",
    "web_ui_max_auth_fail_count": 5,
    "web_ui_port": 8080,
    "web_ui_secure_cookie_enabled": true,
    "web_ui_session_timeout": 3600,
    "web_ui_upnp": false,
    "web_ui_use_custom_http_headers_enabled": false,
    "web_ui_username": "admin"
}
```

## Set application preferences[
Name:`setPreferences`
**Parameters:**
A json object with key-value pairs of the settings you want to change and their new values.
Example:

```
json={"save_path":"C:/Users/Dayman/Downloads","queueing_enabled":false,"scan_dirs":{"C:/Games": 0,"D:/Downloads": 1}}
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

**Notes**:

1. There is no need to pass all possible preferences'`token:value`pairs if you only want to change one option
2. Paths in`scan_dirs`must exist, otherwise this option will have no effect
3. String values must be quoted; integer and boolean values must never be quoted
For a list of possible preference options see[Get application preferences](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-application-preferences)

## Get default save path[
Name:`defaultSavePath`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is a string with the default save path, e.g.`C:/Users/Dayman/Downloads`.

## Get cookies[
Name:`cookies`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is a JSON array in which each element is an entry of the log.
Each element of the array has the following properties:
`name``domain``path``value``expirationDate`
| Property | Type | Description |
| --- | --- | --- |
| string | Cookie name |  |
| string | Cookie domain |  |
| string | Cookie path |  |
| string | Cookie value |  |
| integer | Seconds since epoch |  |

Example:

```
[
    {
        "name":"Example",
        "domain":"example.com",
        "path":"/",
        "value":"foo=bar""expirationDate":1507969127,
    },
]
```

## Set cookies[
Name:`setCookies`
**Parameters:**
A json array of cookies to send when downloading .torrent files.
Each element of the array has the following properties:
`name``domain``path``value``expirationDate`
| Property | Type | Description |
| --- | --- | --- |
| string? | Cookie name |  |
| string? | Cookie domain |  |
| string? | Cookie path |  |
| string? | Cookie value |  |
| integer? | Seconds since epoch |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | Cookies were saved |
| 400 | Request was not a valid json array of cookie objects |


# Log[
All Log API methods are under "log", e.g.:`/api/v2/log/methodName`.

## Get log[
Name:`main`
**Parameters:**
`normal``true`)`info``true`)`warning``true`)`critical``true`)`last_known_id``last_known_id`(default:`-1`)
| Parameter | Type | Description |
| --- | --- | --- |
| bool | Include normal messages (default: |  |
| bool | Include info messages (default: |  |
| bool | Include warning messages (default: |  |
| bool | Include critical messages (default: |  |
| integer | Exclude messages with "message id" <= |  |

Example:

```
/api/v2/log/main?normal=true&info=true&warning=true&critical=true&last_known_id=-1
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON array in which each element is an entry of the log.
Each element of the array has the following properties:
`id``message``timestamp``type``1`, Log::INFO:`2`, Log::WARNING:`4`, Log::CRITICAL:`8`
| Property | Type | Description |
| --- | --- | --- |
| integer | ID of the message |  |
| string | Text of the message |  |
| integer | Seconds since epoch (Note: switched from milliseconds to seconds in v4.5.0) |  |
| integer | Type of the message: Log::NORMAL: |  |

Example:

```
[
    {
        "id":0,
        "message":"qBittorrent v3.4.0 started",
        "timestamp":1507969127,
        "type":1
    },
    {
        "id":1,
        "message":"qBittorrent is trying to listen on any interface port: 19036",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":2,
        "message":"Peer ID: -qB3400-",
        "timestamp":1507969127,
        "type":1
    },
    {
        "id":3,
        "message":"HTTP User-Agent is 'qBittorrent/3.4.0'",
        "timestamp":1507969127,
        "type":1
    },
    {
        "id":4,
        "message":"DHT support [ON]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":5,
        "message":"Local Peer Discovery support [ON]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":6,
        "message":"PeX support [ON]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":7,
        "message":"Anonymous mode [OFF]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":8,
        "message":"Encryption support [ON]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":9,
        "message":"Embedded Tracker [OFF]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":10,
        "message":"UPnP / NAT-PMP support [ON]",
        "timestamp":1507969127,
        "type":2
    },
    {
        "id":11,
        "message":"Web UI: Now listening on port 8080",
        "timestamp":1507969127,
        "type":1
    },
    {
        "id":12,
        "message":"Options were saved successfully.",
        "timestamp":1507969128,
        "type":1
    },
    {
        "id":13,
        "message":"qBittorrent is successfully listening on interface :: port: TCP/19036",
        "timestamp":1507969128,
        "type":2
    },
    {
        "id":14,
        "message":"qBittorrent is successfully listening on interface 0.0.0.0 port: TCP/19036",
        "timestamp":1507969128,
        "type":2
    },
    {
        "id":15,
        "message":"qBittorrent is successfully listening on interface 0.0.0.0 port: UDP/19036",
        "timestamp":1507969128,
        "type":2
    }
]
```

## Get peer log[
Name:`peers`
**Parameters:**
`last_known_id``last_known_id`(default:`-1`)
| Parameter | Type | Description |
| --- | --- | --- |
| integer | Exclude messages with "message id" <= |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response a JSON array. Each element of the array of objects (each object is the information relative to a peer) containing the following fields
`id``ip``timestamp``blocked``reason`
| Property | Type | Description |
| --- | --- | --- |
| integer | ID of the peer |  |
| string | IP of the peer |  |
| integer | Seconds since epoch |  |
| boolean | Whether or not the peer was blocked |  |
| string | Reason of the block |  |


# Sync[
Sync API implements requests for obtaining changes since the last request. All Sync API methods are under "sync", e.g.:`/api/v2/sync/methodName`.

## Get main data[
Name:`maindata`
**Parameters:**
`rid``rid=0`will be assumed. If the given`rid`is different from the one of last server reply,`full_update`will be`true`(see the server reply details for more info)
| Parameter | Type | Description |
| --- | --- | --- |
| integer | Response ID. If not provided, |  |

Example:

```
/api/v2/sync/maindata?rid=14
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON object with the following possible fields
`rid``full_update``torrents`[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list)`torrents_removed``categories``categories_removed``tags``tags_removed``server_state`
| Property | Type | Description |
| --- | --- | --- |
| integer | Response ID |  |
| bool | Whether the response contains all the data or partial data |  |
| object | Property: torrent hash, value: same as |  |
| array | List of hashes of torrents removed since last request |  |
| object | Info for categories added since last request |  |
| array | List of categories removed since last request |  |
| array | List of tags added since last request |  |
| array | List of tags removed since last request |  |
| object | Global transfer info |  |

Example:

```
{
    "rid":15,
    "torrents":
    {
        "8c212779b4abde7c6bc608063a0d008b7e40ce32":
        {
            "state":"pausedUP"
        }
    }
}
```

## Get torrent peers data[
Name:`torrentPeers`
**Parameters:**
`hash``rid``rid=0`will be assumed. If the given`rid`is different from the one of last server reply,`full_update`will be`true`(see the server reply details for more info)
| Parameter | Type | Description |
| --- | --- | --- |
| string | Torrent hash |  |
| integer | Response ID. If not provided, |  |

Example:

```
/api/v2/sync/torrentPeers?hash=8c212779b4abde7c6bc608063a0d008b7e40ce32?rid=14
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is TODO

# Transfer info[
All Transfer info API methods are under "transfer", e.g.:`/api/v2/transfer/methodName`.

## Get global transfer info[
This method returns info you usually see in qBt status bar.
Name:`info`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON object with the following fields
`dl_info_speed``dl_info_data``up_info_speed``up_info_data``dl_rate_limit``up_rate_limit``dht_nodes``connection_status`
| Property | Type | Description |
| --- | --- | --- |
| integer | Global download rate (bytes/s) |  |
| integer | Data downloaded this session (bytes) |  |
| integer | Global upload rate (bytes/s) |  |
| integer | Data uploaded this session (bytes) |  |
| integer | Download rate limit (bytes/s) |  |
| integer | Upload rate limit (bytes/s) |  |
| integer | DHT nodes connected to |  |
| string | Connection status. See possible values here below |  |

In addition to the above in partial data requests (see[Get partial data](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-partial-data)for more info):
`queueing``use_alt_speed_limits``refresh_interval`
| Property | Type | Description |
| --- | --- | --- |
| bool | True if torrent queueing is enabled |  |
| bool | True if alternative speed limits are enabled |  |
| integer | Transfer list refresh interval (milliseconds) |  |

Possible values of`connection_status`:
`connected``firewalled``disconnected`
| Value |
| --- |

Example:

```
{
    "connection_status":"connected",
    "dht_nodes":386,
    "dl_info_data":681521119,
    "dl_info_speed":0,
    "dl_rate_limit":0,
    "up_info_data":10747904,
    "up_info_speed":0,
    "up_rate_limit":1048576
}
```

## Get alternative speed limits state[
Name:`speedLimitsMode`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is`1`if alternative speed limits are enabled,`0`otherwise.

## Toggle alternative speed limits[
Name:`toggleSpeedLimitsMode`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get global download limit[
Name:`downloadLimit`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is the value of current global download speed limit in bytes/second; this value will be zero if no limit is applied.

## Set global download limit[
Name:`setDownloadLimit`
**Parameters:**
`limit`
| Parameter | Type | Description |
| --- | --- | --- |
| integer | The global download speed limit to set in bytes/second |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get global upload limit[
Name:`uploadLimit`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |

The response is the value of current global upload speed limit in bytes/second; this value will be zero if no limit is applied.

## Set global upload limit[
Name:`setUploadLimit`
**Parameters:**
`limit`
| Parameter | Type | Description |
| --- | --- | --- |
| integer | The global upload speed limit to set in bytes/second |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Ban peers[
Name:`banPeers`
**Parameters:**
`peers``|`. Each peer is a colon-separated`host:port`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The peer to ban, or multiple peers separated by a pipe |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


# Torrent management[
All Torrent management API methods are under "torrents", e.g.:`/api/v2/torrents/methodName`.

## Get torrent list[
Name:`info`
**Parameters:**
`filter`*optional*`all`,`downloading`,`seeding`,`completed`,`stopped`,`active`,`inactive`,`running`,`stalled`,`stalled_uploading`,`stalled_downloading`,`errored``category`*optional*`My category`becomes`My%20category``tag`*optional*since 2.8.3`My tag`becomes`My%20tag``sort`*optional*`reverse`*optional*`false``limit`*optional*`offset`*optional*`hashes`*optional*`|`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Filter torrent list by state. Allowed state filters: |  |
| string | Get torrents with the given category (empty string means "without category"; no "category" parameter means "any category"). Remember to URL-encode the category name. For example, |  |
| string | Get torrents with the given tag (empty string means "without tag"; no "tag" parameter means "any tag". Remember to URL-encode the category name. For example, |  |
| string | Sort torrents by given key. They can be sorted using any field of the response's JSON array (which are documented below) as the sort key. |  |
| bool | Enable reverse sorting. Defaults to |  |
| integer | Limit the number of torrents returned |  |
| integer | Set offset (if less than 0, offset from end) |  |
| string | Filter by hashes. Can contain multiple hashes separated by |  |

Example:

```
/api/v2/torrents/info?filter=downloading&category=sample%20category&sort=ratio
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON array with the following fields
`added_on``amount_left``auto_tmm``availability``category``completed``completion_on``content_path``dl_limit``-1`if unlimited.`dlspeed``downloaded``downloaded_session``eta``f_l_piece_prio``force_start``hash``isPrivate``last_activity``magnet_uri``max_ratio``max_seeding_time``name``num_complete``num_incomplete``num_leechs``num_seeds``priority``progress``ratio``ratio_limit``max_ratio`?)`reannounce``save_path``seeding_time``seeding_time_limit``max_seeding_time`?) seeding_time_limit is a per torrent setting, when Automatic Torrent Management is disabled, furthermore then max_seeding_time is set to seeding_time_limit for this torrent. If Automatic Torrent Management is enabled, the value is -2. And if max_seeding_time is unset it have a default value -1.`seen_complete``seq_dl``size``state``super_seeding``tags``time_active``total_size``tracker``up_limit``-1`if unlimited.`uploaded``uploaded_session``upspeed`
| Property | Type | Description |
| --- | --- | --- |
| integer | Time (Unix Epoch) when the torrent was added to the client |  |
| integer | Amount of data left to download (bytes) |  |
| bool | Whether this torrent is managed by Automatic Torrent Management |  |
| float | Percentage of file pieces currently available |  |
| string | Category of the torrent |  |
| integer | Amount of transfer data completed (bytes) |  |
| integer | Time (Unix Epoch) when the torrent completed |  |
| string | Absolute path of torrent content (root path for multifile torrents, absolute file path for singlefile torrents) |  |
| integer | Torrent download speed limit (bytes/s). |  |
| integer | Torrent download speed (bytes/s) |  |
| integer | Amount of data downloaded |  |
| integer | Amount of data downloaded this session |  |
| integer | Torrent ETA (seconds) |  |
| bool | True if first last piece are prioritized |  |
| bool | True if force start is enabled for this torrent |  |
| string | Torrent hash |  |
| bool | True if torrent is from a private tracker (added in 5.0.0) |  |
| integer | Last time (Unix Epoch) when a chunk was downloaded/uploaded |  |
| string | Magnet URI corresponding to this torrent |  |
| float | Maximum share ratio until torrent is stopped from seeding/uploading |  |
| integer | Maximum seeding time (seconds) until torrent is stopped from seeding |  |
| string | Torrent name |  |
| integer | Number of seeds in the swarm |  |
| integer | Number of leechers in the swarm |  |
| integer | Number of leechers connected to |  |
| integer | Number of seeds connected to |  |
| integer | Torrent priority. Returns -1 if queuing is disabled or torrent is in seed mode |  |
| float | Torrent progress (percentage/100) |  |
| float | Torrent share ratio. Max ratio value: 9999. |  |
| float | TODO (what is different from |  |
| integer | Time until the next tracker reannounce |  |
| string | Path where this torrent's data is stored |  |
| integer | Torrent elapsed time while complete (seconds) |  |
| integer | TODO (what is different from |  |
| integer | Time (Unix Epoch) when this torrent was last seen complete |  |
| bool | True if sequential download is enabled |  |
| integer | Total size (bytes) of files selected for download |  |
| string | Torrent state. See table here below for the possible values |  |
| bool | True if super seeding is enabled |  |
| string | Comma-concatenated tag list of the torrent |  |
| integer | Total active time (seconds) |  |
| integer | Total size (bytes) of all file in this torrent (including unselected ones) |  |
| string | The first tracker with working status. Returns empty string if no tracker is working. |  |
| integer | Torrent upload speed limit (bytes/s). |  |
| integer | Amount of data uploaded |  |
| integer | Amount of data uploaded this session |  |
| integer | Torrent upload speed (bytes/s) |  |

Possible values of`state`:
`error``missingFiles``uploading``pausedUP``queuedUP``stalledUP``checkingUP``forcedUP``allocating``downloading``metaDL``pausedDL``queuedDL``stalledDL``checkingDL``forcedDL``checkingResumeData``moving``unknown`
| Value | Description |
| --- | --- |
| Some error occurred, applies to paused torrents |  |
| Torrent data files is missing |  |
| Torrent is being seeded and data is being transferred |  |
| Torrent is paused and has finished downloading |  |
| Queuing is enabled and torrent is queued for upload |  |
| Torrent is being seeded, but no connection were made |  |
| Torrent has finished downloading and is being checked |  |
| Torrent is forced to uploading and ignore queue limit |  |
| Torrent is allocating disk space for download |  |
| Torrent is being downloaded and data is being transferred |  |
| Torrent has just started downloading and is fetching metadata |  |
| Torrent is paused and has NOT finished downloading |  |
| Queuing is enabled and torrent is queued for download |  |
| Torrent is being downloaded, but no connection were made |  |
| Same as checkingUP, but torrent has NOT finished downloading |  |
| Torrent is forced to downloading to ignore queue limit |  |
| Checking resume data on qBt startup |  |
| Torrent is moving to another location |  |
| Unknown status |  |

Example:

```
[
    {
        "dlspeed":9681262,
        "eta":87,
        "f_l_piece_prio":false,
        "force_start":false,
        "hash":"8c212779b4abde7c6bc608063a0d008b7e40ce32",
        "category":"",
        "tags": "",
        "name":"debian-8.1.0-amd64-CD-1.iso",
        "num_complete":-1,
        "num_incomplete":-1,
        "num_leechs":2,
        "num_seeds":54,
        "priority":1,
        "progress":0.16108787059783936,
        "ratio":0,
        "seq_dl":false,
        "size":657457152,
        "state":"downloading",
        "super_seeding":false,
        "upspeed":0,
        "isPrivate":true
    },
    {
        another_torrent_info
    }
]
```

## Get torrent generic properties[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`properties`
**Parameters:**
`hash`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the generic properties of |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is:

- empty, if the torrent hash is invalid
- otherwise, a JSON object with the following fields`save_path``creation_date``piece_size``comment``total_wasted``total_uploaded``total_uploaded_session``total_downloaded``total_downloaded_session``up_limit``dl_limit``time_elapsed``seeding_time``nb_connections``nb_connections_limit``share_ratio``addition_date``completion_date``created_by``dl_speed_avg``dl_speed``eta``last_seen``peers``peers_total``pieces_have``pieces_num``reannounce``seeds``seeds_total``total_size``up_speed_avg``up_speed``isPrivate`
| Property | Type | Description |
| --- | --- | --- |
| string | Torrent save path |  |
| integer | Torrent creation date (Unix timestamp) |  |
| integer | Torrent piece size (bytes) |  |
| string | Torrent comment |  |
| integer | Total data wasted for torrent (bytes) |  |
| integer | Total data uploaded for torrent (bytes) |  |
| integer | Total data uploaded this session (bytes) |  |
| integer | Total data downloaded for torrent (bytes) |  |
| integer | Total data downloaded this session (bytes) |  |
| integer | Torrent upload limit (bytes/s) |  |
| integer | Torrent download limit (bytes/s) |  |
| integer | Torrent elapsed time (seconds) |  |
| integer | Torrent elapsed time while complete (seconds) |  |
| integer | Torrent connection count |  |
| integer | Torrent connection count limit |  |
| float | Torrent share ratio |  |
| integer | When this torrent was added (unix timestamp) |  |
| integer | Torrent completion date (unix timestamp) |  |
| string | Torrent creator |  |
| integer | Torrent average download speed (bytes/second) |  |
| integer | Torrent download speed (bytes/second) |  |
| integer | Torrent ETA (seconds) |  |
| integer | Last seen complete date (unix timestamp) |  |
| integer | Number of peers connected to |  |
| integer | Number of peers in the swarm |  |
| integer | Number of pieces owned |  |
| integer | Number of pieces of the torrent |  |
| integer | Number of seconds until the next announce |  |
| integer | Number of seeds connected to |  |
| integer | Number of seeds in the swarm |  |
| integer | Torrent total size (bytes) |  |
| integer | Torrent average upload speed (bytes/second) |  |
| integer | Torrent upload speed (bytes/second) |  |
| bool | True if torrent is from a private tracker |  |

NB:`-1`is returned if the type of the property is integer but its value is not known.
Example:

```
{
    "addition_date":1438429165,
    "comment":"\"Debian CD from cdimage.debian.org\"",
    "completion_date":1438429234,
    "created_by":"",
    "creation_date":1433605214,
    "dl_limit":-1,
    "dl_speed":0,
    "dl_speed_avg":9736015,
    "eta":8640000,
    "isPrivate":true,
    "last_seen":1438430354,
    "nb_connections":3,
    "nb_connections_limit":250,
    "peers":1,
    "peers_total":89,
    "piece_size":524288,
    "pieces_have":1254,
    "pieces_num":1254,
    "reannounce":672,
    "save_path":"/Downloads/debian-8.1.0-amd64-CD-1.iso",
    "seeding_time":1128,
    "seeds":1,
    "seeds_total":254,
    "share_ratio":0.00072121022562178299,
    "time_elapsed":1197,
    "total_downloaded":681521119,
    "total_downloaded_session":681521119,
    "total_size":657457152,
    "total_uploaded":491520,
    "total_uploaded_session":491520,
    "total_wasted":23481724,
    "up_limit":-1,
    "up_speed":0,
    "up_speed_avg":410
}
```

## Get torrent trackers[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`trackers`
**Parameters:**
`hash`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the trackers of |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is a JSON array, where each element contains info about one tracker, with the following fields
`url``status``tier``>= 0`,`< 0`is used as placeholder when`tier`does not exist for special entries (such as DHT).`num_peers``num_seeds``num_leeches``num_downloaded``msg`
| Property | Type | Description |
| --- | --- | --- |
| string | Tracker url |  |
| integer | Tracker status. See the table below for possible values |  |
| integer | Tracker priority tier. Lower tier trackers are tried before higher tiers. Tier numbers are valid when |  |
| integer | Number of peers for current torrent, as reported by the tracker |  |
| integer | Number of seeds for current torrent, asreported by the tracker |  |
| integer | Number of leeches for current torrent, as reported by the tracker |  |
| integer | Number of completed downloads for current torrent, as reported by the tracker |  |
| string | Tracker message (there is no way of knowing what this message is - it's up to tracker admins) |  |

Possible values of`status`:

| Value | Description |
| --- | --- |
| 0 | Tracker is disabled (used for DHT, PeX, and LSD) |
| 1 | Tracker has not been contacted yet |
| 2 | Tracker has been contacted and is working |
| 3 | Tracker is updating |
| 4 | Tracker has been contacted, but it is not working (or doesn't send proper replies) |

Example:

```
[
    {
        "msg":"",
        "num_peers":100,
        "status":2,
        "url":"http://bttracker.debian.org:6969/announce"
    },
    {
        another_tracker_info
    }
]
```

## Get torrent web seeds[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`webseeds`
**Parameters:**
`hash`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the webseeds of |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is a JSON array, where each element is information about one webseed, with the following fields
`url`
| Property | Type | Description |
| --- | --- | --- |
| string | URL of the web seed |  |

Example:

```
[
    {
        "url":"http://some_url/"
    },
    {
        "url":"http://some_other_url/"
    }
]
```

## Get torrent contents[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`files`
**Parameters:**
`hash``indexes`*optional*since 2.8.2`indexes`can contain multiple values separated by`|`.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the contents of |  |
| string | The indexes of the files you want to retrieve. |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is:

- empty, if the torrent hash is invalid
- otherwise, a JSON array, where each element contains info about one file, with the following fields`index`since 2.8.2`name``size``progress``priority``is_seed``piece_range``availability`
| Property | Type | Description |
| --- | --- | --- |
| integer | File index |  |
| string | File name (including relative path) |  |
| integer | File size (bytes) |  |
| float | File progress (percentage/100) |  |
| integer | File priority. See possible values here below |  |
| bool | True if file is seeding/complete |  |
| integer array | The first number is the starting piece index and the second number is the ending piece index (inclusive) |  |
| float | Percentage of file pieces currently available (percentage/100) |  |

Possible values of`priority`:
`0``1``6``7`
| Value | Description |
| --- | --- |
| Do not download |  |
| Normal priority |  |
| High priority |  |
| Maximal priority |  |

Example:

```
[
    {
        "index":0,
        "is_seed":false,
        "name":"debian-8.1.0-amd64-CD-1.iso",
        "piece_range":[0,1253],
        "priority":1,
        "progress":0,
        "size":657457152,
        "availability":0.5,
    }
]
```

## Get torrent pieces' states[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`pieceStates`
**Parameters:**
`hash`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the pieces' states of |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is:

- empty, if the torrent hash is invalid
- otherwise, an array of states (integers) of all pieces (in order) of a specific torrent.
Value meanings are defined as below:
`0``1``2`
| Value | Description |
| --- | --- |
| Not downloaded yet |  |
| Now downloading |  |
| Already downloaded |  |

Example:

```
[0,0,2,1,0,0,2,1]
```

## Get torrent pieces' hashes[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`pieceHashes`
**Parameters:**
`hash`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent you want to get the pieces' hashes of |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios- see JSON below |

The response is:

- empty, if the torrent hash is invalid
- otherwise, an array of hashes (strings) of all pieces (in order) of a specific torrent.
Example:

```
["54eddd830a5b58480a6143d616a97e3a6c23c439","f8a99d225aa4241db100f88407fc3bdaead583ab","928fb615b9bd4dd8f9e9022552c8f8f37ef76f58"]
```

## Pause torrents[
Requires knowing the torrent hashes. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`stop`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to pause multiple torrents, or set to`all`, to pause all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to pause. |  |

Example:

```
/api/v2/torrents/stop?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Resume torrents[
Requires knowing the torrent hashes. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`start`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to resume multiple torrents, or set to`all`, to resume all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to resume. |  |

Example:

```
/api/v2/torrents/start?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Delete torrents[
Requires knowing the torrent hashes. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`delete`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to delete multiple torrents, or set to`all`, to delete all torrents.`deleteFiles``true`, the downloaded data will also be deleted, otherwise has no effect.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to delete. |  |
| If set to |  |  |

Example:

```
/api/v2/torrents/delete?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32&deleteFiles=false
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Recheck torrents[
Requires knowing the torrent hashes. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`recheck`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to recheck multiple torrents, or set to`all`, to recheck all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to recheck. |  |

Example:

```
/api/v2/torrents/recheck?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Reannounce torrents[
Requires knowing the torrent hashes. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`reannounce`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to reannounce multiple torrents, or set to`all`, to reannounce all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to reannounce. |  |

Example:

```
/api/v2/torrents/reannounce?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Add new torrent[
This method can add torrents from server local file or from URLs.`http://`,`https://`,`magnet:`and`bc://bt/`links are supported.
Add torrent from URLs example:

```
POST /api/v2/torrents/add HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: multipart/form-data; boundary=---------------------------6688794727912Content-Length: length-----------------------------6688794727912Content-Disposition: form-data; name="urls"https://torcache.net/torrent/3B1A1469C180F447B77021074DBBCCAEF62611E7.torrenthttps://torcache.net/torrent/3B1A1469C180F447B77021074DBBCCAEF62611E8.torrent-----------------------------6688794727912Content-Disposition: form-data; name="savepath"C:/Users/qBit/Downloads-----------------------------6688794727912Content-Disposition: form-data; name="category"movies-----------------------------6688794727912Content-Disposition: form-data; name="skip_checking"true-----------------------------6688794727912Content-Disposition: form-data; name="paused"true-----------------------------6688794727912Content-Disposition: form-data; name="root_folder"true-----------------------------6688794727912--
```

Add torrents from files example:

```
POST /api/v2/torrents/add HTTP/1.1Content-Type: multipart/form-data; boundary=-------------------------acebdf13572468User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Length: length---------------------------acebdf13572468Content-Disposition: form-data; name="torrents"; filename="8f18036b7a205c9347cb84a253975e12f7adddf2.torrent"Content-Type: application/x-bittorrentfile_binary_data_goes_here---------------------------acebdf13572468Content-Disposition: form-data; name="torrents"; filename="UFS.torrent"Content-Type: application/x-bittorrentfile_binary_data_goes_here---------------------------acebdf13572468--
```

The above example will add two torrent files.`file_binary_data_goes_here`represents raw data of torrent file (basically a byte array).
`urls``torrents``torrents`can be presented multiple times.`savepath`*optional*`category`*optional*`tags`*optional*`skip_checking`*optional*`true`,`false`(default)`paused`*optional*`true`,`false`(default)`root_folder`*optional*`true`,`false`, unset (default)`rename`*optional*`upLimit`*optional*`dlLimit`*optional*`ratioLimit`*optional*since 2.8.1`seedingTimeLimit`*optional*since 2.8.1`autoTMM`*optional*`sequentialDownload`*optional*`true`,`false`(default)`firstLastPiecePrio`*optional*`true`,`false`(default)
| Property | Type | Description |
| --- | --- | --- |
| string | URLs separated with newlines |  |
| raw | Raw data of torrent file. |  |
| string | Download folder |  |
| string | Category for the torrent |  |
| string | Tags for the torrent, split by ',' |  |
| string | Skip hash checking. Possible values are |  |
| string | Add torrents in the paused state. Possible values are |  |
| string | Create the root folder. Possible values are |  |
| string | Rename torrent |  |
| integer | Set torrent upload speed limit. Unit in bytes/second |  |
| integer | Set torrent download speed limit. Unit in bytes/second |  |
| float | Set torrent share ratio limit |  |
| integer | Set torrent seeding time limit. Unit in minutes |  |
| bool | Whether Automatic Torrent Management should be used |  |
| string | Enable sequential download. Possible values are |  |
| string | Prioritize download first last piece. Possible values are |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 415 | Torrent file is not valid |
| 200 | All other scenarios |


## Add trackers to torrent[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/addTrackers HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhash=8c212779b4abde7c6bc608063a0d008b7e40ce32&urls=http://192.168.0.1/announce%0Audp://192.168.0.1:3333/dummyAnnounce
```

This adds two trackers to torrent with hash`8c212779b4abde7c6bc608063a0d008b7e40ce32`. Note`%0A`(aka LF newline) between trackers. Ampersand in tracker urls**MUST**be escaped.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 200 | All other scenarios |


## Edit trackers[
Name:`editTracker`
**Parameters:**
`hash``origUrl``newUrl``origUrl`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent |  |
| string | The tracker URL you want to edit |  |
| string | The new URL to replace the |  |

**Returns:**
`newUrl`is not a valid URL`newUrl`already exists for the torrent`origUrl`was not found
| HTTP Status Code | Scenario |
| --- | --- |
| 400 |  |
| 404 | Torrent hash was not found |
| 409 |  |
| 409 |  |
| 200 | All other scenarios |


## Remove trackers[
Name:`removeTrackers`
**Parameters:**
`hash``urls``|`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent |  |
| string | URLs to remove, separated by |  |

**Returns:**
`urls`were not found
| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash was not found |
| 409 | All |
| 200 | All other scenarios |


## Add peers[
Name:`addPeers`
**Parameters:**
`hashes``|``peers``|`. Each peer is a colon-separated`host:port`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent, or multiple hashes separated by a pipe |  |
| string | The peer to add, or multiple peers separated by a pipe |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 400 | None of the supplied peers are valid |
| 200 | All other scenarios |


## Increase torrent priority[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`increasePrio`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to increase the priority of multiple torrents, or set to`all`, to increase the priority of all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to increase the priority of. |  |

Example:

```
/api/v2/torrents/increasePrio?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Torrent queueing is not enabled |
| 200 | All other scenarios |


## Decrease torrent priority[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`decreasePrio`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to decrease the priority of multiple torrents, or set to`all`, to decrease the priority of all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to decrease the priority of. |  |

Example:

```
/api/v2/torrents/decreasePrio?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Torrent queueing is not enabled |
| 200 | All other scenarios |


## Maximal torrent priority[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`topPrio`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to set multiple torrents to the maximum priority, or set to`all`, to set all torrents to the maximum priority.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to set to the maximum priority. |  |

Example:

```
/api/v2/torrents/topPrio?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Torrent queueing is not enabled |
| 200 | All other scenarios |


## Minimal torrent priority[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`bottomPrio`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to set multiple torrents to the minimum priority, or set to`all`, to set all torrents to the minimum priority.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to set to the minimum priority. |  |

Example:

```
/api/v2/torrents/bottomPrio?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Torrent queueing is not enabled |
| 200 | All other scenarios |


## Set file priority[
Name:`filePrio`
**Parameters:**
`hash``id``|``priority`[torrent contents API](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents)for possible values)
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent |  |
| string | File ids, separated by |  |
| number | File priority to set (consult |  |

`id`values correspond to file position inside the array returned by[torrent contents API](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents), e.g.`id=0`for first file,`id=1`for second file, etc.
Since 2.8.2 it is recommended to use`index`field returned by[torrent contents API](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents)(since the files can be filtered and the`index`value may differ from the position inside the response array).
**Returns:**
`id`is not a valid integer`id`was not found
| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Priority is invalid |
| 400 | At least one file |
| 404 | Torrent hash was not found |
| 409 | Torrent metadata hasn't downloaded yet |
| 409 | At least one file |
| 200 | All other scenarios |


## Get torrent download limit[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/downloadLimit HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0
```

`hashes`can contain multiple hashes separated by`|`or set to`all`
Server reply (example):

```
HTTP/1.1 200 OKcontent-type: application/jsoncontent-length: length

{"8c212779b4abde7c6bc608063a0d008b7e40ce32":338944,"284b83c9c7935002391129fd97f43db5d7cc2ba0":123}
```

`8c212779b4abde7c6bc608063a0d008b7e40ce32`is the hash of the torrent and`338944`its download speed limit in bytes per second; this value will be zero if no limit is applied.

## Set torrent download limit[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setDownloadLimit HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&limit=131072
```

`hashes`can contain multiple hashes separated by`|`or set to`all``limit`is the download speed limit in bytes per second you want to set.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set torrent share limit[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setShareLimits HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&ratioLimit=1.0&seedingTimeLimit=60&inactiveSeedingTimeLimit=-2
```

**Parameters:**
`hashes``|`or set to`all`.`ratioLimit``-2`means the global limit should be used,`-1`means no limit.`seedingTimeLimit``-2`means the global limit should be used,`-1`means no limit.`inactiveSeedingTimeLimit``-2`means the global limit should be used,`-1`means no limit.
| Property | Type | Description |
| --- | --- | --- |
| integer | The hashes of the torrents for which you want to set the share limits. Multiple hashes need to be separated by |  |
| float | The maximum seeding ratio for the torrent. |  |
| integer | The maximum seeding time (minutes) for the torrent. |  |
| integer | The maximum amount of time (minutes) the torrent is allowed to seed while being inactive. |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All other scenarios |
| 400 | Bad Request, e.g. missing parameter |


## Get torrent upload limit[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/uploadLimit HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0
```

`hashes`can contain multiple hashes separated by`|`or set to`all`
Server reply (example):

```
HTTP/1.1 200 OKcontent-type: application/jsoncontent-length: length

{"8c212779b4abde7c6bc608063a0d008b7e40ce32":338944,"284b83c9c7935002391129fd97f43db5d7cc2ba0":123}
```

`8c212779b4abde7c6bc608063a0d008b7e40ce32`is the hash of the torrent in the request and`338944`its upload speed limit in bytes per second; this value will be zero if no limit is applied.

## Set torrent upload limit[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setUploadLimit HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&limit=131072
```

`hashes`can contain multiple hashes separated by`|`or set to`all``limit`is the upload speed limit in bytes per second you want to set.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set torrent location[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setLocation HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&location=/mnt/nfs/media
```

`hashes`can contain multiple hashes separated by`|`or set to`all``location`is the location to download the torrent to. If the location doesn't exist, the torrent's location is unchanged.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Save path is empty |
| 403 | User does not have write access to directory |
| 409 | Unable to create save path directory |
| 200 | All other scenarios |


## Set torrent name[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/rename HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhash=8c212779b4abde7c6bc608063a0d008b7e40ce32&name=This%20is%20a%20test
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Torrent hash is invalid |
| 409 | Torrent name is empty |
| 200 | All other scenarios |


## Set torrent category[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setCategory HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&category=CategoryName
```

`hashes`can contain multiple hashes separated by`|`or set to`all`
`category`is the torrent category you want to set.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Category name does not exist |
| 200 | All other scenarios |


## Get all categories[
Name:`categories`
Parameters:
None
Returns all categories in JSON format, e.g.:

```
{
    "Video": {
        "name": "Video",
        "savePath": "/home/user/torrents/video/"
    },
    "eBooks": {
        "name": "eBooks",
        "savePath": "/home/user/torrents/eBooks/"
    }
}
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Add new category[
```
POST /api/v2/torrents/createCategory HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthcategory=CategoryName&savePath=/path/to/dir
```

`category`is the category you want to create.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Category name is empty |
| 409 | Category name is invalid |
| 200 | All other scenarios |


## Edit category[
```
POST /api/v2/torrents/editCategory HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthcategory=CategoryName&savePath=/path/to/save/torrents/to
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Category name is empty |
| 409 | Category editing failed |
| 200 | All other scenarios |


## Remove categories[
```
POST /api/v2/torrents/removeCategories HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthcategories=Category1%0ACategory2
```

`categories`can contain multiple cateogies separated by`\n`(%0A urlencoded)
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Add torrent tags[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/addTags HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&tags=TagName1,TagName2
```

`hashes`can contain multiple hashes separated by`|`or set to`all`
`tags`is the list of tags you want to add to passed torrents.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Remove torrent tags[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/removeTags HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&tags=TagName1,TagName2
```

`hashes`can contain multiple hashes separated by`|`or set to`all`
`tags`is the list of tags you want to remove from passed torrents. Empty list removes all tags from relevant torrents.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get all tags[
Name:`tags`
Parameters:
None
Returns all tags in JSON format, e.g.:

```
[
    "Tag 1",
    "Tag 2"
]
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Create tags[
```
POST /api/v2/torrents/createTags HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthtags=TagName1,TagName2
```

`tags`is a list of tags you want to create. Can contain multiple tags separated by`,`.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Delete tags[
```
POST /api/v2/torrents/deleteTags HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthtags=TagName1,TagName2
```

`tags`is a list of tags you want to delete. Can contain multiple tags separated by`,`.
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set automatic torrent management[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setAutoManagement HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|284b83c9c7935002391129fd97f43db5d7cc2ba0&enable=true
```

`hashes`can contain multiple hashes separated by`|`or set to`all``enable`is a boolean, affects the torrents listed in`hashes`, default is`false`
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Toggle sequential download[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`toggleSequentialDownload`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to toggle sequential download for multiple torrents, or set to`all`, to toggle sequential download for all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to toggle sequential download for. |  |

Example:

```
/api/v2/torrents/toggleSequentialDownload?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set first/last piece priority[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).
Name:`toggleFirstLastPiecePrio`
**Parameters:**
`hashes``hashes`can contain multiple hashes separated by`|`, to toggle the first/last piece priority for multiple torrents, or set to`all`, to toggle the first/last piece priority for all torrents.
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hashes of the torrents you want to toggle the first/last piece priority for. |  |

Example:

```
/api/v2/torrents/toggleFirstLastPiecePrio?hashes=8c212779b4abde7c6bc608063a0d008b7e40ce32|54eddd830a5b58480a6143d616a97e3a6c23c439
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set force start[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setForceStart HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32?value=true
```

`hashes`can contain multiple hashes separated by`|`or set to`all``value`is a boolean, affects the torrents listed in`hashes`, default is`false`
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set super seeding[
Requires knowing the torrent hash. You can get it from[torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list).

```
POST /api/v2/torrents/setSuperSeeding HTTP/1.1User-Agent: FiddlerHost: 127.0.0.1Cookie: SID=your_sidContent-Type: application/x-www-form-urlencodedContent-Length: lengthhashes=8c212779b4abde7c6bc608063a0d008b7e40ce32?value=true
```

`hashes`can contain multiple hashes separated by`|`or set to`all``value`is a boolean, affects the torrents listed in`hashes`, default is`false`
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Rename file[
Name:`renameFile`
**Parameters:**
`hash``oldPath``newPath`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent |  |
| string | The old path of the torrent |  |
| string | The new path to use for the file |  |

**Returns:**
`newPath`parameter`newPath`or`oldPath`, or`newPath`already in use
| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Missing |
| 409 | Invalid |
| 200 | All other scenarios |


## Rename folder[
Name:`renameFolder`
**Parameters:**
`hash``oldPath``newPath`
| Parameter | Type | Description |
| --- | --- | --- |
| string | The hash of the torrent |  |
| string | The old path of the torrent |  |
| string | The new path to use for the file |  |

**Returns:**
`newPath`parameter`newPath`or`oldPath`, or`newPath`already in use
| HTTP Status Code | Scenario |
| --- | --- |
| 400 | Missing |
| 409 | Invalid |
| 200 | All other scenarios |


# RSS (experimental)[
All RSS API methods are under "rss", e.g.:`/api/v2/rss/methodName`.

## Add folder[
Name:`addFolder`
Parameters:
`path`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Full path of added folder (e.g. "The Pirate Bay\Top100") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Failure to add folder |
| 200 | All other scenarios |


## Add feed[
Name:`addFeed`
Parameters:
`url`[http://thepiratebay.org/rss//top100/200](http://thepiratebay.org/rss//top100/200)")`path`*optional*
| Parameter | Type | Description |
| --- | --- | --- |
| string | URL of RSS feed (e.g. " |  |
| string | Full path of added folder (e.g. "The Pirate Bay\Top100\Video") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Failure to add feed |
| 200 | All other scenarios |


## Remove item[
Removes folder or feed.
Name:`removeItem`
Parameters:
`path`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Full path of removed item (e.g. "The Pirate Bay\Top100") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Failure to remove item |
| 200 | All other scenarios |


## Move item[
Moves/renames folder or feed.
Name:`moveItem`
Parameters:
`itemPath``destPath`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Current full path of item (e.g. "The Pirate Bay\Top100") |  |
| string | New full path of item (e.g. "The Pirate Bay") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 409 | Failure to move item |
| 200 | All other scenarios |


## Get all items[
Name:`items`
Parameters:
`withData`*optional*
| Parameter | Type | Description |
| --- | --- | --- |
| bool | True if you need current feed articles |  |

Returns all RSS items in JSON format, e.g.:

```
{
    "HD-Torrents.org": "https://hd-torrents.org/rss.php",
    "PowerfulJRE": "https://www.youtube.com/feeds/videos.xml?channel_id=UCzQUP1qoWDoEbmsQxvdjxgQ",
    "The Pirate Bay": {
        "Audio": "https://thepiratebay.org/rss//top100/100",
        "Video": "https://thepiratebay.org/rss//top100/200"
    }
}
```

## Mark as read[
If`articleId`is provided only the article is marked as read otherwise the whole feed is going to be marked as read.
Name:`markAsRead`
Parameters:
`itemPath``articleId`*optional*
| Parameter | Type | Description |
| --- | --- | --- |
| string | Current full path of item (e.g. "The Pirate Bay\Top100") |  |
| string | ID of article |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Refresh item[
Refreshes folder or feed.
Name:`refreshItem`
Parameters:
`itemPath`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Current full path of item (e.g. "The Pirate Bay\Top100") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Set auto-downloading rule[
Name:`setRule`
Parameters:
`ruleName``ruleDef`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Rule name (e.g. "Punisher") |  |
| string | JSON encoded rule definition |  |

Rule definition is JSON encoded dictionary with the following fields:
`enabled``mustContain``mustNotContain``useRegex``episodeFilter``smartFilter``previouslyMatchedEpisodes``affectedFeeds``ignoreDays``lastMatch``addPaused``assignedCategory``savePath`
| Field | Type | Description |
| --- | --- | --- |
| bool | Whether the rule is enabled |  |
| string | The substring that the torrent name must contain |  |
| string | The substring that the torrent name must not contain |  |
| bool | Enable regex mode in "mustContain" and "mustNotContain" |  |
| string | Episode filter definition |  |
| bool | Enable smart episode filter |  |
| list | The list of episode IDs already matched by smart filter |  |
| list | The feed URLs the rule applied to |  |
| number | Ignore sunsequent rule matches |  |
| string | The rule last match time |  |
| bool | Add matched torrent in paused mode |  |
| string | Assign category to the torrent |  |
| string | Save torrent to the given directory |  |

E.g.:

```
{
    "enabled": false,
    "mustContain": "The *Punisher*",
    "mustNotContain": "",
    "useRegex": false,
    "episodeFilter": "1x01-;",
    "smartFilter": false,
    "previouslyMatchedEpisodes": [
    ],
    "affectedFeeds": [
        "http://showrss.info/user/134567.rss?magnets=true"
    ],
    "ignoreDays": 0,
    "lastMatch": "20 Nov 2017 09:05:11",
    "addPaused": true,
    "assignedCategory": "",
    "savePath": "C:/Users/JohnDoe/Downloads/Punisher"
}
```

## Rename auto-downloading rule[
Name:`renameRule`
Parameters:
`ruleName``newRuleName`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Rule name (e.g. "Punisher") |  |
| string | New rule name (e.g. "The Punisher") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Remove auto-downloading rule[
Name:`removeRule`
Parameters:
`ruleName`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Rule name (e.g. "Punisher") |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get all auto-downloading rules[
Name:`rules`
Returns all auto-downloading rules in JSON format, e.g.:

```
{
    "The Punisher": {
        "enabled": false,
        "mustContain": "The *Punisher*",
        "mustNotContain": "",
        "useRegex": false,
        "episodeFilter": "1x01-;",
        "smartFilter": false,
        "previouslyMatchedEpisodes": [
        ],
        "affectedFeeds": [
            "http://showrss.info/user/134567.rss?magnets=true"
        ],
        "ignoreDays": 0,
        "lastMatch": "20 Nov 2017 09:05:11",
        "addPaused": true,
        "assignedCategory": "",
        "savePath": "C:/Users/JohnDoe/Downloads/Punisher"
    }
}
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Get all articles matching a rule[
Name:`matchingArticles`
`ruleName`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Rule name (e.g. "Linux") |  |

Returns all articles that match a rule by feed name in JSON format, e.g.:

```
{
    "DistroWatch":[
        "sparkylinux-5.11-i686-minimalgui.iso.torrent",
        "sparkylinux-5.11-x86_64-minimalgui.iso.torrent",
        "sparkylinux-5.11-i686-xfce.iso.torrent",
        "bluestar-linux-5.6.3-2020.04.09-x86_64.iso.torrent",
        "robolinux64-mate3d-v10.10.iso.torrent",
    ],
    "Linuxtracker":[
        "[Alpine Linux] alpine-extended-3.11.6",
        "[Alpine Linux] alpine-standard-3.11.6",
        "[Linuxfx] linuxfx10-wxs-lts-beta5.iso",
        "[Linux Lite] linux-lite-5.0-rc1-64bit.iso (MULTI)",
        "[Scientific Linux] SL-7.8-x86_64-Pack",
        "[NixOS] nixos-plasma5-20.03.1418.5272327b81e-x86_64-linux.iso"
    ]
}
```

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


# Search[
All Search API methods are under "search", e.g.:`/api/v2/search/methodName`.

## Start search[
Name:`start`
**Parameters:**
`pattern``plugins``|`. Also supports`all`and`enabled``category``plugins`. Also supports`all`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Pattern to search for (e.g. "Ubuntu 18.04") |  |
| string | Plugins to use for searching (e.g. "legittorrents"). Supports multiple plugins separated by |  |
| string | Categories to limit your search to (e.g. "legittorrents"). Available categories depend on the specified |  |

**Returns:**
`Running`searches (currently set to 5)
| HTTP Status Code | Scenario |
| --- | --- |
| 409 | User has reached the limit of max |
| 200 | All other scenarios- see JSON below |

The response is a JSON object with the following fields
`id`
| Field | Type | Description |
| --- | --- | --- |
| number | ID of the search job |  |

Example:

```
{
    "id": 12345
}
```

## Stop search[
Name:`stop`
**Parameters:**
`id`
| Parameter | Type | Description |
| --- | --- | --- |
| number | ID of the search job |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Search job was not found |
| 200 | All other scenarios |


## Get search status[
Name:`status`
**Parameters:**
`id`*optional*
| Parameter | Type | Description |
| --- | --- | --- |
| number | ID of the search job. If not specified, all search jobs are returned |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Search job was not found |
| 200 | All other scenarios- see JSON below |

The response is a JSON array of objects containing the following fields
`id``status``Running`or`Stopped`)`total``Running`this number may contineu to increase
| Field | Type | Description |
| --- | --- | --- |
| number | ID of the search job |  |
| string | Current status of the search job (either |  |
| number | Total number of results. If the status is |  |

Example:

```
[
    {
        "id": 12345,
        "status": "Running",
        "total": 170
    }
]
```

## Get search results[
Name:`results`
**Parameters:**
`id``limit`*optional*`offset`*optional*`-2`returns the 2 most recent results)
| Parameter | Type | Description |
| --- | --- | --- |
| number | ID of the search job |  |
| number | max number of results to return. 0 or negative means no limit |  |
| number | result to start at. A negative number means count backwards (e.g. |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Search job was not found |
| 409 | Offset is too large, or too small (e.g. absolute value of negative number is greater than # results) |
| 200 | All other scenarios- see JSON below |

The response is a JSON object with the following fields
`results``result`objects- see table below`status``Running`or`Stopped`)`total``Running`this number may continue to increase
| Field | Type | Description |
| --- | --- | --- |
| array | Array of |  |
| string | Current status of the search job (either |  |
| number | Total number of results. If the status is |  |

**Result object:**
`descrLink``fileName``fileSize``fileUrl``nbLeechers``nbSeeders``siteUrl`
| Field | Type | Description |
| --- | --- | --- |
| string | URL of the torrent's description page |  |
| string | Name of the file |  |
| number | Size of the file in Bytes |  |
| string | Torrent download link (usually either .torrent file or magnet link) |  |
| number | Number of leechers |  |
| number | Number of seeders |  |
| string | URL of the torrent site |  |

Example:

```
{
    "results": [
        {
            "descrLink": "http://www.legittorrents.info/index.php?page=torrent-details&id=8d5f512e1acb687029b8d7cc6c5a84dce51d7a41",
            "fileName": "Ubuntu-10.04-32bit-NeTV.ova",
            "fileSize": -1,
            "fileUrl": "http://www.legittorrents.info/download.php?id=8d5f512e1acb687029b8d7cc6c5a84dce51d7a41&f=Ubuntu-10.04-32bit-NeTV.ova.torrent",
            "nbLeechers": 1,
            "nbSeeders": 0,
            "siteUrl": "http://www.legittorrents.info"
        },
        {
            "descrLink": "http://www.legittorrents.info/index.php?page=torrent-details&id=d5179f53e105dc2c2401bcfaa0c2c4936a6aa475",
            "fileName": "mangOH-Legato-17_06-Ubuntu-16_04.ova",
            "fileSize": -1,
            "fileUrl": "http://www.legittorrents.info/download.php?id=d5179f53e105dc2c2401bcfaa0c2c4936a6aa475&f=mangOH-Legato-17_06-Ubuntu-16_04.ova.torrent",
            "nbLeechers": 0,
            "nbSeeders": 59,
            "siteUrl": "http://www.legittorrents.info"
        }
    ],
    "status": "Running",
    "total": 2
}
```

## Delete search[
Name:`delete`
**Parameters:**
`id`
| Parameter | Type | Description |
| --- | --- | --- |
| number | ID of the search job |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 404 | Search job was not found |
| 200 | All other scenarios |


## Get search plugins[
Name:`plugins`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios- see JSON below |

The response is a JSON array of objects containing the following fields
`enabled``fullName``name``supportedCategories``url``version`
| Field | Type | Description |
| --- | --- | --- |
| bool | Whether the plugin is enabled |  |
| string | Full name of the plugin |  |
| string | Short name of the plugin |  |
| array | List of category objects |  |
| string | URL of the torrent site |  |
| string | Installed version of the plugin |  |


```
[
    {
        "enabled": true,
        "fullName": "Legit Torrents",
        "name": "legittorrents",
        "supportedCategories": [{
            "id": "all",
            "name": "All categories"
        }, {
            "id": "anime",
            "name": "Anime"
        }, {
            "id": "books",
            "name": "Books"
        }, {
            "id": "games",
            "name": "Games"
        }, {
            "id": "movies",
            "name": "Movies"
        }, {
            "id": "music",
            "name": "Music"
        }, {
            "id": "tv",
            "name": "TV shows"
        }],
        "url": "http://www.legittorrents.info",
        "version": "2.3"
    }
]
```

## Install search plugin[
Name:`installPlugin`
**Parameters:**
`sources`[https://raw.githubusercontent.com/qbittorrent/search-plugins/master/nova3/engines/legittorrents.py](https://raw.githubusercontent.com/qbittorrent/search-plugins/master/nova3/engines/legittorrents.py)"). Supports multiple sources separated by`|`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Url or file path of the plugin to install (e.g. " |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Uninstall search plugin[
Name:`uninstallPlugin`
**Parameters:**
`names``|`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Name of the plugin to uninstall (e.g. "legittorrents"). Supports multiple names separated by |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Enable search plugin[
Name:`enablePlugin`
**Parameters:**
`names``|``enable`
| Parameter | Type | Description |
| --- | --- | --- |
| string | Name of the plugin to enable/disable (e.g. "legittorrents"). Supports multiple names separated by |  |
| bool | Whether the plugins should be enabled |  |

**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


## Update search plugins[
Name:`updatePlugins`
**Parameters:**
None
**Returns:**

| HTTP Status Code | Scenario |
| --- | --- |
| 200 | All scenarios |


# WebAPI versioning[
WebAPI uses the following versioning:`1.2.3`:

1. Main version. Should be changed only on some global changes (e.g. total redesign/relayout)
2. Changed on incompatible API changes (i.e. if it breaks outdated clients). E.g. if you change/remove something
3. Changed on compatible API changes (i.e. if it doesn't break outdated clients). E.g. if you add something new outdated clients still can access old subset of API.
[Go back to home](https://github.com/qbittorrent/qBittorrent/wiki)

## :host { --tooltip-top: var(--tool-tip-position-top, 0); --tooltip-left: var(--tool-tip-position-left, 0); padding: var(--overlay-paddingBlock-condensed) var(--overlay-padding-condensed) !important; font: var(--text-body-shorthand-small); color: var(--tooltip-fgColor, var(--fgColor-onEmphasis)) !important; text-align: center; text-decoration: none; text-shadow: none; text-transform: none; letter-spacing: normal; word-wrap: break-word; white-space: pre; background: var(--tooltip-bgColor, var(--bgColor-emphasis)) !important; border-radius: var(--borderRadius-medium); border: 0 !important; opacity: 0; max-width: var(--overlay-width-small); word-wrap: break-word; white-space: normal; width: max-content !important; inset: var(--tooltip-top) auto auto var(--tooltip-left) !important; overflow: visible !important; text-wrap: balance; } :host(:is(.tooltip-n, .tooltip-nw, .tooltip-ne)) { --tooltip-top: calc(var(--tool-tip-position-top, 0) - var(--overlay-offset, 0.25rem)); --tooltip-left: var(--tool-tip-position-left); } :host(:is(.tooltip-s, .tooltip-sw, .tooltip-se)) { --tooltip-top: calc(var(--tool-tip-position-top, 0) + var(--overlay-offset, 0.25rem)); --tooltip-left: var(--tool-tip-position-left); } :host(.tooltip-w) { --tooltip-top: var(--tool-tip-position-top); --tooltip-left: calc(var(--tool-tip-position-left, 0) - var(--overlay-offset, 0.25rem)); } :host(.tooltip-e) { --tooltip-top: var(--tool-tip-position-top); --tooltip-left: calc(var(--tool-tip-position-left, 0) + var(--overlay-offset, 0.25rem)); } :host:after{ position: absolute; display: block; right: 0; left: 0; height: var(--overlay-offset, 0.25rem); content: ""; } :host(.tooltip-s):after, :host(.tooltip-se):after, :host(.tooltip-sw):after { bottom: 100% } :host(.tooltip-n):after, :host(.tooltip-ne):after, :host(.tooltip-nw):after { top: 100%; } @keyframes tooltip-appear { from { opacity: 0; } to { opacity: 1; } } :host(:popover-open), :host(:popover-open):before { animation-name: tooltip-appear; animation-duration: .1s; animation-fill-mode: forwards; animation-timing-function: ease-in; } :host(.\:popover-open) { animation-name: tooltip-appear; animation-duration: .1s; animation-fill-mode: forwards; animation-timing-function: ease-in; } @media (forced-colors: active) { :host { outline: solid 1px transparent; } :host:before { display: none; } }Toggle table of contentsPages72
- Loading[Home:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Alternate WebUI usage:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Anonymous Mode:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Alpine Linux:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation CentOS 7.x:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation CentOS 8.x:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Debian and Ubuntu:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Debian, Ubuntu, and derivatives:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation FreeBSD (no GUI):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Fully static binaries on Linux (glibc or musl):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation macOS:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation macOS (x86_64, arm64, cross compilation):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 10.0 (dynamic linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 2008 (static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 2010 (x86_64) (dynamic linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 2013 (static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 2013 (x86_64) (dynamic linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation MSVC 2017 (x86_64) (static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Raspberry Pi OS and DietPi:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Raspbian for LeMaker Banana Pro:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation Windows (MSVC 2019, 64 bit, static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compilation with CMake common information:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compiling MSVC 2017 (static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Compiling with MSVC 2019 (static linkage):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Create custom themes for qBittorrent:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Developing alternate WebUIs (WIP):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Disable connections not supported by proxies:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Explanation of Options in qBittorrent:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[External programs How to:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[External programs savecategory:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Frequently Asked Questions:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to bind your vpn to prevent ip leaks:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to convert base32 to base16 info hashes:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to debug the WebUI code:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to diagnose IO error, BSOD, crash (Windows):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to diagnose IO errors:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to diagnostic IO error, BSOD, crash [GNU Linux, BSD, etc.]:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to disable auto seed:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to Disable DHT, PeX, and LPD:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to translate qBittorrent:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to use custom UI themes:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to use MaxMind's GeoIP database:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to use portable mode:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[How to use qBittorrent as a tracker:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[I forgot my UI lock password:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[IIS ARR Reverse Proxy:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Installing qBittorrent:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Linux WebUI HTTPS with Let's Encrypt & Caddy2 reverse proxy:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Linux WebUI HTTPS with Let's Encrypt certificates and NGINX SSL reverse proxy:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Linux WebUI setting up HTTPS with Let's Encrypt certificates:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Linux WebUI setting up HTTPS with self signed SSL certificates:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[List of known alternate WebUIs:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[List of known qBittorrent themes:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[List of unofficial WebAPI clients:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[NGINX Reverse Proxy for Web UI:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Obsolete compilation guides:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[OpenVPN and qBittorrent without X server:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[qBittorrent is not downloading or uploading Is it slow:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Running qBittorrent without X server (WebUI only):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Running qBittorrent without X server (WebUI only, systemd service set up, Ubuntu 15.04 or newer):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Setup GDB with Qt pretty printers:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Status of Missing files at start up or after restart:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Things we need to know to help you with 'speed' issues:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Traefik Reverse Proxy for Web UI:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Unofficial search plugins:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Using VSCode for qBittorrent development:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[Web UI password locked on qBittorrent NO X (qbittorrent nox):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[WebUI API (qBittorrent 4.1):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[WebUI API (qBittorrent 5.0)
  - [Table of Contents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#table-of-contents)
  - [Changes](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#changes)
  - [API v2.9.3](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#api-v293)
  - [API v2.11.3](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#api-v2113)
  - [General Information](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#general-information)
  - [Authentication](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#authentication)
  - [Login](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#login)
  - [Logout](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#logout)
  - [Application](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#application)
  - [Get application version](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-application-version)
  - [Get API version](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-api-version)
  - [Get build info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-build-info)
  - [Shutdown application](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#shutdown-application)
  - [Get application preferences](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-application-preferences)
  - [Set application preferences](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-application-preferences)
  - [Get default save path](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-default-save-path)
  - [Get cookies](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-cookies)
  - [Set cookies](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-cookies)
  - [Log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#log)
  - [Get log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-log)
  - [Get peer log](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-peer-log)
  - [Sync](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#sync)
  - [Get main data](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-main-data)
  - [Get torrent peers data](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-peers-data)
  - [Transfer info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#transfer-info)
  - [Get global transfer info](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-transfer-info)
  - [Get alternative speed limits state](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-alternative-speed-limits-state)
  - [Toggle alternative speed limits](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#toggle-alternative-speed-limits)
  - [Get global download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-download-limit)
  - [Set global download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-global-download-limit)
  - [Get global upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-global-upload-limit)
  - [Set global upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-global-upload-limit)
  - [Ban peers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#ban-peers)
  - [Torrent management](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#torrent-management)
  - [Get torrent list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list)
  - [Get torrent generic properties](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-generic-properties)
  - [Get torrent trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-trackers)
  - [Get torrent web seeds](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-web-seeds)
  - [Get torrent contents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents)
  - [Get torrent pieces' states](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-pieces-states)
  - [Get torrent pieces' hashes](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-pieces-hashes)
  - [Pause torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#pause-torrents)
  - [Resume torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#resume-torrents)
  - [Delete torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-torrents)
  - [Recheck torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#recheck-torrents)
  - [Reannounce torrents](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#reannounce-torrents)
  - [Add new torrent](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-new-torrent)
  - [Add trackers to torrent](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-trackers-to-torrent)
  - [Edit trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#edit-trackers)
  - [Remove trackers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-trackers)
  - [Add peers](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-peers)
  - [Increase torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#increase-torrent-priority)
  - [Decrease torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#decrease-torrent-priority)
  - [Maximal torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#maximal-torrent-priority)
  - [Minimal torrent priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#minimal-torrent-priority)
  - [Set file priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-file-priority)
  - [Get torrent download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-download-limit)
  - [Set torrent download limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-download-limit)
  - [Set torrent share limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-share-limit)
  - [Get torrent upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-upload-limit)
  - [Set torrent upload limit](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-upload-limit)
  - [Set torrent location](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-location)
  - [Set torrent name](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-name)
  - [Set torrent category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-torrent-category)
  - [Get all categories](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-categories)
  - [Add new category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-new-category)
  - [Edit category](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#edit-category)
  - [Remove categories](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-categories)
  - [Add torrent tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-torrent-tags)
  - [Remove torrent tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-torrent-tags)
  - [Get all tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-tags)
  - [Create tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#create-tags)
  - [Delete tags](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-tags)
  - [Set automatic torrent management](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-automatic-torrent-management)
  - [Toggle sequential download](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#toggle-sequential-download)
  - [Set first/last piece priority](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-firstlast-piece-priority)
  - [Set force start](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-force-start)
  - [Set super seeding](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-super-seeding)
  - [Rename file](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-file)
  - [Rename folder](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-folder)
  - [RSS (experimental)](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rss-experimental)
  - [Add folder](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-folder)
  - [Add feed](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-feed)
  - [Remove item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-item)
  - [Move item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#move-item)
  - [Get all items](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-items)
  - [Mark as read](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#mark-as-read)
  - [Refresh item](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#refresh-item)
  - [Set auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#set-auto-downloading-rule)
  - [Rename auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#rename-auto-downloading-rule)
  - [Remove auto-downloading rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-auto-downloading-rule)
  - [Get all auto-downloading rules](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-auto-downloading-rules)
  - [Get all articles matching a rule](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-all-articles-matching-a-rule)
  - [Search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#search)
  - [Start search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#start-search)
  - [Stop search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#stop-search)
  - [Get search status](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-status)
  - [Get search results](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-results)
  - [Delete search](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#delete-search)
  - [Get search plugins](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-search-plugins)
  - [Install search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#install-search-plugin)
  - [Uninstall search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#uninstall-search-plugin)
  - [Enable search plugin](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#enable-search-plugin)
  - [Update search plugins](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#update-search-plugins)
  - [WebAPI versioning](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#webapi-versioning)
- Loading[WebUI API (qBittorrent v3.1.x):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[WebUI API (qBittorrent v3.2.0 v4.0.4):host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Loading[What is a bug:host {display: block;}
### Uh oh!

There was an error while loading.[Please reload this page](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)).


- Show 57 more pages…
## General[
- [Installing qBittorrent](https://github.com/qbittorrent/qBittorrent/wiki/Installing-qBittorrent)
- [Frequently Asked Questions (FAQ)](https://github.com/qbittorrent/qBittorrent/wiki/Frequently-Asked-Questions)
- [qBittorrent options (current and deprecated)](https://github.com/qbittorrent/qBittorrent/wiki/Explanation-of-Options-in-qBittorrent)
- [How to use qBittorrent as a tracker](https://github.com/qbittorrent/qBittorrent/wiki/How-to-use-qBittorrent-as-a-tracker)
- [How to use portable mode](https://github.com/qbittorrent/qBittorrent/wiki/How-to-use-portable-mode)
- [Anonymous mode](https://github.com/qbittorrent/qBittorrent/wiki/Anonymous-Mode)
- [How to bind your vpn to prevent ip leaks](https://github.com/qbittorrent/qBittorrent/wiki/How-to-bind-your-vpn-to-prevent-ip-leaks.md)
### Troubleshooting[
- [qBittorrent support forum](http://forum.qbittorrent.org/)
- [I forgot my GUI lock password](https://github.com/qbittorrent/qBittorrent/wiki/I-forgot-my-UI-lock-password)
- [I forgot my WebUI password](https://github.com/qbittorrent/qBittorrent/wiki/Web-UI-password-locked-on-qBittorrent-NO-X-%28qbittorrent-nox%29)
- [Speed issues](https://github.com/qbittorrent/qBittorrent/wiki/Things-we-need-to-know-to-help-you-with-'speed'-issues)
### External programs[
- [How-to](https://github.com/qbittorrent/qBittorrent/wiki/External-programs-How-to)
- [`savecategory`
### Search plugins[
- [List of unofficial search plugins](https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins)
### Themes[
- [Developing custom UI themes](https://github.com/qbittorrent/qBittorrent/wiki/Create-custom-themes-for-qBittorrent)
- [How to use custom UI themes](https://github.com/qbittorrent/qBittorrent/wiki/How-to-use-custom-UI-themes)
- [List of unofficial themes](https://github.com/qbittorrent/qBittorrent/wiki/List-of-known-qBittorrent-themes)
### Translation[
- [How to translate qBittorrent](https://github.com/qbittorrent/qBittorrent/wiki/How-to-translate-qBittorrent)
---

## WebUI[
### WebUI API[[Current](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0))[Previous](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1))[Previous](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-v3.2.0-v4.0.4))[Obsolete](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-v3.1.x))
| State | Version |
| --- | --- |
| qBittorrent >= 5.0 |  |
| qBittorrent v4.1.0 - v4.6.x |  |
| qBittorrent v3.2.0 - v4.0.x |  |
| qBittorrent < v3.2.0 |  |


### WebAPI clients[
- [List of unofficial WebAPI clients](https://github.com/qbittorrent/qBittorrent/wiki/List-of-unofficial-WebAPI-clients)
### Alternate WebUI[
- [Alternate WebUI usage](https://github.com/qbittorrent/qBittorrent/wiki/Alternate-WebUI-usage)
- [Developing alternate WebUIs](https://github.com/qbittorrent/qBittorrent/wiki/Developing-alternate-WebUIs-(WIP))
- [List of unofficial alternate WebUIs](https://github.com/qbittorrent/qBittorrent/wiki/List-of-known-alternate-WebUIs)
### Reverse proxy setup for WebUI access[
- [NGINX](https://github.com/qbittorrent/qBittorrent/wiki/NGINX-Reverse-Proxy-for-Web-UI)
- [Microsoft IIS ARR](https://github.com/qbittorrent/qBittorrent/wiki/IIS-ARR-Reverse-Proxy)
- [Traefik](https://github.com/qbittorrent/qBittorrent/wiki/Traefik-Reverse-Proxy-for-Web-UI)
### WebUI HTTPS configuration[
- [Let's Encrypt Certificates + Caddy2 Reverse Proxy](https://github.com/qbittorrent/qBittorrent/wiki/Linux-WebUI-HTTPS-with-Let's-Encrypt-&-Caddy2-reverse-proxy)
- [Let's Encrypt certificates + NGINX reverse proxy - Linux](https://github.com/qbittorrent/qBittorrent/wiki/Linux-WebUI-HTTPS-with-Let's-Encrypt-certificates-and-NGINX-SSL-reverse-proxy)
- [Let's Encrypt certificates - Linux](https://github.com/qbittorrent/qBittorrent/wiki/Linux-WebUI-setting-up-HTTPS-with-Let's-Encrypt-certificates)
- [Self-signed SSL certificates - Linux](https://github.com/qbittorrent/qBittorrent/wiki/Linux-WebUI-setting-up-HTTPS-with-self-signed-SSL-certificates)
---

## Linux[
- [Running qBittorrent without X server (WebUI only)](https://github.com/qbittorrent/qBittorrent/wiki/Running-qBittorrent-without-X-server-(WebUI-only))
- [Running qBittorrent without X server (WebUI only, systemd service set up, Ubuntu 15.04 or newer)](https://github.com/qbittorrent/qBittorrent/wiki/Running-qBittorrent-without-X-server-(WebUI-only,-systemd-service-set-up,-Ubuntu-15.04-or-newer))
- [OpenVPN and qBittorrent without X server](https://github.com/qbittorrent/qBittorrent/wiki/OpenVPN-and-qBittorrent-without-X-server)
---

## Development[
- [Coding style](https://github.com/qbittorrent/qBittorrent/blob/master/CODING_GUIDELINES.md)
- [Contributing](https://github.com/qbittorrent/qBittorrent/blob/master/CONTRIBUTING.md)
- [How to write a search plugin](https://github.com/qbittorrent/search-plugins/wiki/How-to-write-a-search-plugin)
- [Using VSCode for qBittorrent development](https://github.com/qbittorrent/qBittorrent/wiki/Using-VSCode-for-qBittorrent-development)
- [Setup GDB with Qt pretty printers](https://github.com/qbittorrent/qBittorrent/wiki/Setup-GDB-with-Qt-pretty-printers)
- [How to debug WebUI code](https://github.com/qbittorrent/qBittorrent/wiki/How-to-debug-the-WebUI-code)
### Compilation[
[Common information for CMake](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-with-CMake-common-information)

#### *BSD, Linux[
- [Alpine Linux](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Alpine-Linux)
- [CentOS 8.x](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-CentOS-8.x)
- [Debian / Ubuntu and derivatives (CMake)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Debian,-Ubuntu,-and-derivatives)
- [Debian / Ubuntu and derivatives (autotools/qmake)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Debian-and-Ubuntu)
- [Docker](https://github.com/qbittorrent/docker-qbittorrent-nox#readme)
- [FreeBSD (no GUI)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-FreeBSD-(no-GUI))
- [Fully static binaries on Linux (glibc or musl)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Fully-static-binaries-on-Linux-(glibc-or-musl))
- [Raspberry Pi OS / DietPi](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Raspberry-Pi-OS-and-DietPi)
- [Raspbian for LeMaker Banana Pro](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Raspbian-for-LeMaker-Banana-Pro)
#### macOS[
- [cmake (x86_64, arm64, cross-compilation, static linkage)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-macOS-(x86_64,-arm64,-cross-compilation))
- [autotools/qmake](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-macOS)
#### Windows[
- [MSVC 2019 (CMake, static linkage)](https://github.com/qbittorrent/qBittorrent/wiki/Compilation-Windows-(MSVC-2019,-64-bit,-static-linkage))
- [MSVC 2019 (qmake, static linkage)](https://github.com/qbittorrent/qBittorrent/wiki/Compiling-with-MSVC-2019-(static-linkage))
- [MSYS2](https://github.com/Chocobo1/qbittorrent_msys2#readme)
[Obsolete compilation guides](https://github.com/qbittorrent/qBittorrent/wiki/Obsolete-compilation-guides)

### Clone this wiki locally
## Footer[© 2026 GitHub, Inc.
### Footer navigation
- [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
- [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
- [Security](https://github.com/security)
- [Status](https://www.githubstatus.com/)
- [Community](https://github.community/)
- [Docs](https://docs.github.com/)
- [Contact](https://support.github.com/?tags=dotcom-footer)
- Manage cookies
- Do not share my personal informationYou can’t perform that action at this time.