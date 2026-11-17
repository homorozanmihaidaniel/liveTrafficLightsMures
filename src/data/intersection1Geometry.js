// Geometrie 100% fidelă, organică și ULTRA-SMOOTH pentru:
// Intersecția 1: 46°32'47.3"N 24°34'07.4"E (Bernády György - Papiu Ilarian - Nicolae Iorga - Revoluției)
//
// Toate bordurile, racordările de colț și curbele de trafic sunt racordate continuu (Bézier C1/C2)

export const INT1_GEOMETRY = {
  viewBox: '0 0 1000 1000',
  center: { x: 500, y: 500 },

  // Contur ultra-smooth al asfaltului (fără colțuri ascuțite, racordări line tip arc de cerc)
  roadsOutline: `
    M 472 3 L 662 0 L 555 250 Q 482 397 557 418 Q 743 506 994 565 L 999 721 Q 874 677 781 793 L 581 1017 L 425 1013 L 601 801 Q 647 692 489 563 Q 311 440 244 491 Q 95 615 -43 793 L -139 712 Q 72 507 125 408 Q 165 347 4 259 L -5 100 L 220 228 Q 307 267 358 226 Z
  `,


  // Insule cu racordări line
  islands: [
    // 1. Insula triunghiulară din Sud cu borduri netede
    {
      id: 'south_triangle',
      path: 'M 703 623 L 780 649 Q 794 657 788 662 L 722 734 Q 708 751 704 736 L 679 641 Q 678 624 694 622 Z',
      points: '605,680 675,680 640,790',
      fill: '#131924',
      stroke: '#cbd5e1',
      strokeWidth: 2,
      hatchLines: [
        'M 679 635 L 784 664',
        'M 684 660 L 770 681',
        'M 691 686 L 752 702',
        'M 698 712 L 734 721',
      ],
    },
  ],

  // Marcaje de benzi fluide
  markings: [
    // --- BRAȚUL NORD (Bernády György - 5 benzi) ---
    { d: 'M 582 1 L 453 282', stroke: '#cbd5e1', strokeWidth: 3, dashed: false },
    { d: 'M 506 0 L 386 248', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 540 0 L 418 264', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 626 0 L 500 295', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // --- BRAȚUL VEST (Strada Revoluției - 5 benzi) ---
    { d: 'M 0 140 L 119 218 ', stroke: '#cbd5e1', strokeWidth: 1.5, dashed: false },
    { d: 'M 0 180 L 99 246', stroke: '#94a3b8', strokeWidth: 3, dashed: true },
    { d: 'M 0 220 L 80 272', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
 
    // --- BRAȚUL SUD-VEST (3 benzi din centru spre Papiu) ---
    { d: 'M 134 465 L 0 624', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 164 489 L 0 676', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
  
    // --- BRAȚUL SUD (Papiu Ilarian spre centru) ---
    { d: 'M 533 957 C 655,817 685,742 612,595', fill: 'none', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 830 669 L 780 722', fill: 'none', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 564 976 C 624 891 697 809 705 747', fill: 'none', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // --- BRAȚUL EST (Str. Nicolae Iorga) ---
    { d: 'M 564 537 Q 719 591 951 670', stroke: '#94a3b8', strokeWidth: 3, dashed: true },
    { d: 'M 575 502 Q 728 563 977 637', stroke: '#cbd5e1', strokeWidth: 1.5, dashed: false },
    { d: 'M 590 468 Q 774 551 981 599', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
  ],

  // Treceri de pietoni și linii de STOP rotunjite la capete
  crosswalks: [
    {
      id: 'cw_north',
      arm: 'north',
      rects: [{ x: 355, y: 245, width: 180, height: 20, rotation: 24 }],
      stopLine: 'M 360 234 L 446 274',
    },
    {
      id: 'cw_east',
      arm: 'east',
      rects: [{ x: 790, y: 520, width: 130, height: 20, rotation: 110 }],
      stopLine: 'M 801 521 L 761 633',
    },
    {
      id: 'cw_south',
      arm: 'south',
      rects: [{ x: 745, y: 710, width: 100, height: 30, rotation: 39 }],
      stopLine: 'M 790 655 L 881 684',
    },
    {
      id: 'cw_west',
      arm: 'west',
      rects: [{ x: 85, y: 300, width: 140, height: 30, rotation: -55 }],
      stopLine: 'M 120 218 L 70 291',
    },
  ],

  // Săgețile direcționale
  laneArrows: [
    { x: 390, y: 190, rotation: 205, type: 'right' },
    { x: 428, y: 205, rotation: 205, type: 'straight' },
    { x: 460, y: 220, rotation: 205, type: 'straight' },
    { x: 592, y: 840, rotation: 40, type: 'straight_left' },
    { x: 622, y: 870, rotation: 40, type: 'straight' },
    { x: 800, y: 680, rotation: 40, type: 'right' },
    { x: 834, y: 700, rotation: 40, type: 'right' },
    { x: 50, y: 540, rotation: -140, type: 'straight' },
    { x: 75, y: 563, rotation: -140, type: 'straight' },
    { x: 105, y: 590, rotation: -140, type: 'straight' },
    { x: 60, y: 200, rotation: 123, type: 'left' },
    { x: 41, y: 230, rotation: 123, type: 'straight' },
    { x: 25, y: 255, rotation: 123, type: 'right' },
    { x: 840, y: 545, rotation: -70, type: 'straight_right' },
    { x: 830, y: 575, rotation: -70, type: 'left' },
  ],

  // Traiectorii Bézier continue ULTRA-SMOOTH
  flows: [
    // Faza 1: Acces Est (Verde)
    {
      id: 'flow_e_w',
      phaseId: 1,
      name: 'Est -> Vest (Înainte)',
      d: 'M 921 567 Q 542 470 11 129',
      strokeWidth: 22,
      arm: 'east',
    },
    {
      id: 'flow_e_s',
      phaseId: 1,
      name: 'Est -> Sud-Vest (Stânga)',
      d: 'M 914 594 Q 488 460 315 450 C 195 447 10 706 -105 821',
      strokeWidth: 22,
      arm: 'east',
    },
    {
      id: 'flow_e_n',
      phaseId: 1,
      name: 'Est -> Nord (Dreapta)',
      d: 'M 917 566 Q 335 351 292 392 C 195 447 149 443 -130 802',
      strokeWidth: 20,
      arm: 'east',
    },

    // Faza 2: Acces Sud (Verde)
    {
      id: 'flow_s_n',
      phaseId: 2,
      name: 'Sud -> Nord (Înainte)',
      d: 'M 555 956 Q 749 755 625 561 C 431 414 497 324 619 51',
      strokeWidth: 20,
      arm: 'south',
    },
    {
      id: 'flow_s_n',
      phaseId: 2,
      name: 'Sud -> Nord (Înainte)',
      d: 'M 530 934 Q 720 734 544 557 C 362 382 478 338 584 44',
      strokeWidth: 20,
      arm: 'south',
    },
    {
      id: 'flow_s_w',
      phaseId: 2,
      name: 'Sud -> Vest (Stânga)',
      d: 'M 507 953 Q 896 610 36 144',
      strokeWidth: 20,
      arm: 'south',
    },
    {
      id: 'flow_s_w',
      phaseId: 2,
      name: 'Sud -> Sud (Jos)',
      d: 'M 507 953 C 824 676 437 523 411 486 C 228 353 158 575 -14 726',
      strokeWidth: 20,
      arm: 'south',
    },
    {
      id: 'flow_s_e_1',
      phaseId: 2,
      name: 'Sud -> Est (Dreapta banda 1)',
      d: 'M 613 943 C 884 609 849 666 1149 738',
      strokeWidth: 18,
      arm: 'south',
    },
    {
      id: 'flow_s_e_2',
      phaseId: 2,
      name: 'Sud -> Est (Dreapta banda 2)',
      d: 'M 613 943 C 855 545 819 625 1191 710',
      strokeWidth: 18,
      arm: 'south',
    },

    // Faza 3: Acces Vest (Verde)
    {
      id: 'flow_w_n',
      phaseId: 3,
      name: 'Vest -> Nord (Stânga)',
      d: 'M 34 183 C 284 328 431 513 541 147',
      strokeWidth: 20,
      arm: 'west',
    },
    {
      id: 'flow_w_e',
      phaseId: 3,
      name: 'Vest -> Est (Înainte)',
      d: 'M 25 218 Q 369 455 867 670',
      strokeWidth: 22,
      arm: 'west',
    },
    {
      id: 'flow_w_e',
      phaseId: 3,
      name: 'Vest -> Est (Înainte)',
      d: 'M 44 189 Q 369 455 915 638',
      strokeWidth: 22,
      arm: 'west',
    },
    {
      id: 'flow_w_s',
      phaseId: 3,
      name: 'Vest -> Sud (Dreapta)',
      d: 'M 26 253 C 300 399 57 505 -62 665',
      strokeWidth: 22,
      arm: 'west',
    },

    // Faza 4: Acces Nord (Verde)
    {
      id: 'flow_n_s_1',
      phaseId: 4,
      name: 'Nord -> Sud (Banda 1)',
      d: 'M 443 101 C 314 333 404 371 7 126',
      strokeWidth: 20,
      arm: 'north',
    },
    {
      id: 'flow_n_s_2',
      phaseId: 4,
      name: 'Nord -> Sud (Banda 2)',
      d: 'M 485 78 C 315 490 219 353 13 635',
      strokeWidth: 20,
      arm: 'north',
    },
    {
      id: 'flow_n_s_2',
      phaseId: 4,
      name: 'Nord -> Est (Banda 2)',
      d: 'M 509 93 C 313 512 298 439 998 657',
      strokeWidth: 20,
      arm: 'north',
    },
    {
      id: 'flow_n_w',
      phaseId: 4,
      name: 'Nord -> Vest (Dreapta)',
      d: 'M 528 50 C 327 553 289 331 2 700',
      strokeWidth: 20,
      arm: 'north',
    },
  ],
};
