<?php
  require_once ("../../backend/header.php");
?><!DOCTYPE html>
<html lang="pt_BR">
<head>

  <title>Título</title>

  <!-- SEO rel="nofollow" on links
  ======================================================== -->
  <meta name="robots" content="NOINDEX, nofollow" />  
  <meta name="title" content="Título">
  <meta name="description" content="Descrição">

  <?php 
    //Chama o arquivo head.php
    include '../../template/head.php'; 
  ?>
  <!-- Main Style -->
  <link rel="stylesheet" href="../../assets/css/main.css">

</head>

<body class="no-js painel">

  <?php 
    //Chama o arquivo header.php
    include '../../template/header.php'; 
  ?>

  <h1>Painel</h1>
  <p>Olá <?php echo $nome; ?>. Seu email é <?php echo $email; ?> e seu id é <?php echo $profile_id; ?></p>
  <a href="../../sair.php">Sair</a>

  <?php 
    //Chama o arquivo footer.php
    include '../../template/footer.php'; 
  ?>

  <div id="grid"></div><!-- #grid -->

  <!-- javascript
  ======================================================== -->
  <!-- socket io -->
  <script src="/socket.io/socket.io.js"></script>
  <!-- jquery jquery.com -->
  <script src="http://localhost/magicraft/www/assets/js/jquery.js?v=1.11.0"></script>
  <script type="text/javascript">
    var socket = io();
  </script>
  <!-- players -->
  <script src="http://localhost/magicraft/www/assets/js/jquery.players.js"></script>
  <!-- init -->
  <script src="http://localhost/magicraft/www/assets/js/jquery.init.js"></script>
  <!-- control -->
  <script src="http://localhost/magicraft/www/assets/js/jquery.control.js"></script>

  <?php 
    //Chama o arquivo script.php
    include '../../template/script.php'; 
  ?>

</body>
</html>
