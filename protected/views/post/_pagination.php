<?php
/* @var $post SinglePost */
?>
<div class="post-box paging paging-bottom">
    <noscript><ul>
        <?php
        for ($i = 0, $c = sizeof($post->post_content); $i < $c; $i++) {
            if ($i == 0 || $i == $post->page) {
                continue;
            } ?>
            <li><a href="<?php echo $post->getPermalink($i); ?>"><?php echo CHtml::encode($post->getTitleForPage($i, $post->post_title)); ?></a></li>
            <?php } ?>
    </ul></noscript>
</div>