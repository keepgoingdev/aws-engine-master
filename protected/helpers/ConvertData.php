<?php
/**
 * Some helper methods for data converting
 */
class ConvertData
{
  public static function extractName($name, $separator = '-', $ucfirst = true) {
      $name = implode(' ', explode($separator, $name));
      return $ucfirst?ucfirst($name):$name;
  }
}
