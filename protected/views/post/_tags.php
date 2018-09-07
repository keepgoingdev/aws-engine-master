<?php
/* @var $post SinglePost */
?>
   <div id="tags" class="post-box tags"><?php
       for($i=0,$c=sizeof($post->tags);$i<$c;$i++) {
        if($i == 3) { ?><span class="hidden-tags"><?php } ?>
       <a rel="tag" href="<?php echo $post->getTaglink($post->tags[$i])?>"><?php echo ConvertData::extractName($post->tags[$i]) ?></a>
           <?php }
       if($c > 3) { ?>
       </span>
       <a class="switch-tags" href="#">+</a>
       <?php } ?>
   </div>