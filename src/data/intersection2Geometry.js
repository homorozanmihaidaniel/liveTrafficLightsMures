// Geometrie fidelă 100%, organică și ULTRA-SMOOTH pentru:
// Intersecția 2: 46°32'47.1"N 24°33'48.9"E (Piața Trandafirilor - Revoluției)
//
// Toate bordurile și curbele de viraj sunt racordate continuu (fără colțuri rigide)

export const INT2_GEOMETRY = {
  viewBox: '0 0 1000 1000',
  center: { x: 500, y: 500 },

  // Contur ultra-smooth al carosabilului
  roadsOutline: `
    M -67 674 L 338 452 Q 461 391 439 242 L 411 0 Q 482 2 604 0 L 629 155 Q 671 223 737 218 Q 788 208 1211 51 L 1210 269 Q 647 480 599 580 Q 580 621 596 678 L 724 981 L 526 980 L 418 766 Q 379 702 257 735 Q 81 813 -63 883 Z
  `,

  // Insulă triunghiulară cu borduri rotunjite la colțul parcării
  triangularIsland: {
    path: 'M 425 137 L 426 143 Q 429 148 438 146 L 496 140 Q 504 134 497 129 L 431 91 Q 421 87 422 97 Z',
    points: '360,330 415,330 390,260',
    fill: '#131924',
    stroke: '#cbd5e1',
    strokeWidth: 2,
    hatchLines: [
      'M 430 142 L 452 105',
      'M 451 141 L 469 116',
      'M 482 139 L 490 127',
    ],
  },

  // Parcare marcată "P" cu locuri de parcare oblice
  parkingArea: {
    points: '470,250 445,40 420,40 445,250',
    labelX: 447,
    labelY: 180,
    stalls: [
      'M 416 -30 L 505 17',
      'M 421 26 L 507 70',
      'M 425 82 L 504 129',
    ],
  },


  // Marcaje de benzi fluide
  markings: [
    // Vest (Piața Trandafirilor): 3 benzi
    { d: 'M -152 797 L 170 639', stroke: '#cbd5e1', strokeWidth: 3, dashed: false }, // mediană
    { d: 'M -135 854 L 196 692', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // Est (Piața Trandafirilor spre N. Iorga): 3 benzi
    { d: 'M 844 272 L 1273 98', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 864 337 L 1300 162', stroke: '#cbd5e1', strokeWidth: 3, dashed: false }, // mediană
 
    // Sud (Str. Revoluției): 3 benzi (1 ieșire, 2 intrări)
    { d: 'M 516 823 L 628 1080', stroke: '#cbd5e1', strokeWidth: 3, dashed: false }, // mediană
    { d: 'M 574 798 L 700 1083', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // Curbă punctată galbenă de ghidare viraj Sud -> Est (conform schiței)
    { d: 'M 575 801 C 448 504 517 460 867 336', stroke: '#f59e0b', strokeWidth: 2, dashed: true },
  ],

  // Treceri de pietoni (Zebre) și Linii de Stop rotunjite
  crosswalks: [
    {
      id: 'cw2_main',
      arm: 'main',
      rects: [{ x: 800, y: 215, width: 210, height: 50, rotation: 68 }],
      stopLine: 'M 815 214 L 863 335',
    },
    {
      id: 'cw2_north',
      arm: 'north',
      rects: [{ x: 465, y: 160, width: 165, height: 50, rotation: -6 }],
      stopLine: 'M 516 824 L 626 776',
    },
    {
      id: 'cw2_south',
      arm: 'south',
      rects: [{ x: 440, y: 780, width: 190, height: 50, rotation: -23 }],
      stopLine: 'M 170 642 L 223 747',
    },
  ],

  // Săgețile direcționale
  laneArrows: [
    { x: 90, y: 710, rotation: 62, type: 'straight' },
    { x: 110, y: 765, rotation: 65, type: 'right' },
    { x: 65, y: 650, rotation: -115, type: 'straight' },
    { x: 870, y: 220, rotation: -114, type: 'straight_right' },
    { x: 895, y: 285, rotation: -114, type: 'straight' },
    { x: 500, y: 860, rotation: 160, type: 'straight' },
    { x: 558, y: 840, rotation: -22, type: 'straight' },
    { x: 620, y: 815, rotation: -22, type: 'right' },
  ],

  // Traiectorii Bézier continue ULTRA-SMOOTH
  flows: [
    // Faza 1: Acces Est & Viraj Parcare (Verde)
    {
      id: 'int2_flow_e_w',
      phaseId: 1,
      name: 'Est -> Vest (Înainte)',
      d: 'M 989 177 Q 439 414 -17 693',
      strokeWidth: 22,
      arm: 'east',
    },
    {
      id: 'int2_flow_e_n',
      phaseId: 1,
      name: 'Est -> Parcare Nord',
      d: 'M 991 173 C 588 365 541 240 535 45',
      strokeWidth: 20,
      arm: 'east',
    },
    {
      id: 'int2_flow_s_n',
      phaseId: 1,
      name: 'Sud -> Parcare Nord',
      d: 'M 975 259 Q 270 458 530 954',
      strokeWidth: 22,
      arm: 'south',
    },

    // Faza 2: Acces Sud (Verde)
    {
      id: 'int2_flow_s_w',
      phaseId: 2,
      name: 'Sud -> Vest (Stânga)',
      d: 'M 591 913 C 443 523 290 509 18 657',
      strokeWidth: 22,
      arm: 'south',
    },

    {
      id: 'int2_flow_s_n2',
      phaseId: 2,
      name: 'Sud -> Nord (Înainte)',
      d: 'M 591 913 C 373 486 636 616 532 71',
      strokeWidth: 22,
      arm: 'south',
    },
    {
      id: 'int2_flow_s_e',
      phaseId: 2,
      name: 'Sud -> Est (Dreapta)',
      d: 'M 644 867 C 419 458 607 492 1061 295',
      strokeWidth: 22,
      arm: 'south',
    },

    // Faza 3: Ax Principal Vest (Verde)
    {
      id: 'int2_flow_w_e',
      phaseId: 3,
      name: 'Vest -> Est (Ax Principal)',
      d: 'M 64 715 Q 473 501 979 332',
      strokeWidth: 24,
      arm: 'west',
    },
    {
      id: 'int2_flow_w_n',
      phaseId: 3,
      name: 'Vest -> Nord (Ax Principal)',
      d: 'M 64 715 Q 650 491 532 2',
      strokeWidth: 24,
      arm: 'west',
    },
    {
      id: 'int2_flow_w_s',
      phaseId: 3,
      name: 'Vest -> Sud (Dreapta)',
      d: 'M 95 772 C 389 599 458 715 545 948',
      strokeWidth: 20,
      arm: 'west',
    },
  ],
};
