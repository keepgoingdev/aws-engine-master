# Install & Update

AWS Engine is installed on 3 servers:
* ftp://aws-new@70.38.112.120 - main blog (http://allwomenstalk.com);
* ftp://ftpawssub@70.38.31.242 (70.38.112.120) - subblogs (http://*.allwomenstalk.com);
* ftp://ftpaws-experimental@70.38.31.242 (70.38.112.120) - experimental, only Lifestyle subblog for now.

To install it on a new server one need just to upload appropriate version from the repository except some files (listed below). No any configuration steps needed for any All Women Stalk site.

To update AWS engine following steps shoud be performed:

1. Copy /css/all.css into /css/allnew-&lt;version&gt;.css on the main blog server. Version is stored in /protected/config/main.php.

2. Upload engine files to the appropriate server, except:
 * /assets - Yii stores compressed JS here;
 * /local - local configuration and templates, this directory is empty in repository and is ignored by git;
 * /protected/runtime - Yii service directory;
 * /.git, /.gitignore, /.gitmodules - git service files
 * /yii - the framework itself, contains many rarely updated files, no need to transfer them all every time;
 * /index-test.php - used only in test mode.

**Warning**:
Experimental server _may_ contain some local configuration or changes that is not in the repository. Be sure to adjust them for the version you uploading.

[source](https://github.com/allwomenstalk/aws-engine/wiki/Install-&-Update)

#Configuration

Git version is pre-configured for domains &lt;blog&gt;.allwomenstalk.com.

Most user-configurable parameters are stored in /protected/config/params.php. If these parameters should be redefined for specific AWS Engine instance (for example, on testing domain), this should be done in /local/config/params.php in order to simplify updates. Parameters file format:
```
<?php
return array(
  'paramName'=>'paramValue',
  ...
);
```

### Blog (category) selection
Category to fetch posts from is determined automatically from current subdomain. The 'aws' category is set by default and is used when blog can't be determined (e. g. on http://allwomenstalk.com).
Category may be explicitly set using the 'site' configuration parameter.

## Pre-load actions
File /local/start.php is executed before the Yii framework is loaded and application is run.
It can be used, for example, to enable debug mode:
```
<?php
defined('YII_DEBUG') or define('YII_DEBUG',true);
// specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',3);
```

[source](https://github.com/allwomenstalk/aws-engine/wiki/Configuration)
"# aws-engine-master" 
