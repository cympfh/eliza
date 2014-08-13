module.exports = (function() {

  // safe ID list
  var us = [
    'nisehorn',
    'Ayana_take', 'FukuharaKaori', 'HeidemarieSan', 'Jishu_Kisei', 'Ma_ri_ya_i', 'Mari_navi', 'N_Suganuma', 'Nitta_Emi', 'OrehaGandamu', 'SKYH_O_RSE_2', 'ShimizuKaori', 'StTunamayo', 'Yasu_umi', '_3000world_', '__1927', '_namori_', 'a40san', 'aahheeaadd', 'aeasya', 'akekodao', 'bokudaga', 'carbon_fourteen', 'carbon_twelve', 'chilchil_2030', 'cympfh', 'ddaaeehhaa', 'dotlisp', 'exfina', 'freezer999', 'fuchigami_mai', 'furukawasayuri', 'g_kun_dow', 'galileidonna', 'gattino123', 'h013', 'habu_kun', 'han_meg_han', 'hidamarerbip', 'hidamarervip', 'itoshiki_ku', 'kenkyo_yushu', 'l_mirin', 'lll_anna_lll', 'mimori_suzuko', 'minamo__i', 'miyokichi86', 'nin_ten', 'ninja_fujiyama', 'nu_ma', 'nyoromo123', 'pedonopedo', 'perikue', 'periqke', 'perique', 'vajiru', 'y3eadgbe', 'yuriehiyoko', 'yuriehiyoko2_2', 'zaisei_hatan'
  ]

  function safe(name) {
    return us.indexOf(name) !== -1
  };

  return safe;
}());
