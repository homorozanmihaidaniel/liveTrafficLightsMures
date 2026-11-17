// Geometrie fidelă 100%, organică și ULTRA-SMOOTH pentru:
// Intersecția 2: 46°32'47.1"N 24°33'48.9"E (Piața Trandafirilor - Revoluției)
//
// Toate bordurile și curbele de viraj sunt racordate continuu (fără colțuri rigide)

export const INT2_GEOMETRY = {
  viewBox: '0 0 1000 1000',
  center: { x: 500, y: 500 },

  // Contur ultra-smooth al carosabilului
  roadsOutline: `
    M 0,440 
    L 320,345 
    Q 360,330 380,240 
    L 420,30 
    Q 505,50 590,70 
    L 550,210 
    Q 540,265 620,250 
    Q 780,215 1000,180 
    L 1000,380 
    Q 580,450 490,520 
    Q 450,570 510,1000 
    L 330,1000 
    Q 290,620 270,550 
    Q 240,490 0,580 
    Z
  `,

  // Parcare marcată "P" cu locuri de parcare oblice
  parkingArea: {
    points: '360,330 420,40 395,40 335,330',
    labelX: 380,
    labelY: 170,
    stalls: [
      'M 345,290 L 405,240',
      'M 355,240 L 415,190',
      'M 365,190 L 425,140',
      'M 375,140 L 435,90',
    ],
  },

  // Insulă triunghiulară cu borduri rotunjite la colțul parcării
  triangularIsland: {
    path: 'M 365,330 L 410,330 Q 418,330 412,320 L 394,265 Q 390,255 386,265 L 362,320 Q 358,330 365,330 Z',
    points: '360,330 415,330 390,260',
    fill: '#131924',
    stroke: '#cbd5e1',
    strokeWidth: 2,
    hatchLines: [
      'M 368,320 L 410,320',
      'M 374,305 L 404,305',
      'M 380,290 L 398,290',
    ],
  },

  // Marcaje de benzi fluide
  markings: [
    // Vest (Piața Trandafirilor): 3 benzi
    { d: 'M 0,490 L 290,400', stroke: '#cbd5e1', strokeWidth: 3, dashed: true },
    { d: 'M 0,540 L 250,460', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // Est (Piața Trandafirilor spre N. Iorga): 3 benzi
    { d: 'M 545,280 L 1000,230', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },
    { d: 'M 550,330 L 1000,280', stroke: '#cbd5e1', strokeWidth: 3, dashed: false }, // mediană
    { d: 'M 555,380 L 1000,330', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // Sud (Str. Revoluției): 3 benzi (1 ieșire, 2 intrări)
    { d: 'M 310,640 L 400,1000', stroke: '#cbd5e1', strokeWidth: 3, dashed: true },
    { d: 'M 370,640 L 450,1000', stroke: '#94a3b8', strokeWidth: 1.5, dashed: true },

    // Curbă punctată galbenă de ghidare viraj Sud -> Est (conform schiței)
    { d: 'M 370,640 Q 420,530 555,380', stroke: '#f59e0b', strokeWidth: 2, dashed: true },
  ],

  // Treceri de pietoni (Zebre) și Linii de Stop rotunjite
  crosswalks: [
    {
      id: 'cw2_main',
      arm: 'main',
      rects: [{ x: 535, y: 280, width: 22, height: 130, rotation: 10 }],
      stopLine: 'M 535,280 L 545,340',
    },
    {
      id: 'cw2_north',
      arm: 'north',
      rects: [{ x: 360, y: 315, width: 165, height: 18, rotation: -3 }],
      stopLine: 'M 360,335 L 525,335',
    },
    {
      id: 'cw2_south',
      arm: 'south',
      rects: [{ x: 250, y: 610, width: 175, height: 18, rotation: -12 }],
      stopLine: 'M 320,620 L 420,600',
    },
  ],

  // Săgețile direcționale
  laneArrows: [
    { x: 90, y: 515, rotation: 75, type: 'straight' },
    { x: 90, y: 560, rotation: 75, type: 'right' },
    { x: 90, y: 465, rotation: -105, type: 'straight' },
    { x: 750, y: 250, rotation: -105, type: 'straight_right' },
    { x: 750, y: 310, rotation: -105, type: 'straight' },
    { x: 345, y: 840, rotation: 165, type: 'straight' },
    { x: 395, y: 840, rotation: -15, type: 'straight' },
    { x: 445, y: 840, rotation: -15, type: 'right' },
  ],

  // Traiectorii Bézier continue ULTRA-SMOOTH
  flows: [
    // Faza 1: Acces Est & Viraj Parcare (Verde)
    {
      id: 'int2_flow_e_w',
      phaseId: 1,
      name: 'Est -> Vest (Înainte)',
      d: 'M 980,310 Q 530,320 20,460',
      strokeWidth: 22,
      arm: 'east',
    },
    {
      id: 'int2_flow_e_n',
      phaseId: 1,
      name: 'Est -> Parcare Nord',
      d: 'M 980,250 Q 520,240 515,50',
      strokeWidth: 20,
      arm: 'east',
    },
    {
      id: 'int2_flow_s_n',
      phaseId: 1,
      name: 'Sud -> Parcare Nord',
      d: 'M 395,980 Q 360,500 515,50',
      strokeWidth: 22,
      arm: 'south',
    },

    // Faza 2: Acces Sud (Verde)
    {
      id: 'int2_flow_s_w',
      phaseId: 2,
      name: 'Sud -> Vest (Stânga)',
      d: 'M 395,980 Q 370,520 20,480',
      strokeWidth: 22,
      arm: 'south',
    },

    // Faza 3: Ax Principal Vest (Verde)
    {
      id: 'int2_flow_w_e',
      phaseId: 3,
      name: 'Vest -> Est (Ax Principal)',
      d: 'M 20,520 Q 450,440 980,340',
      strokeWidth: 24,
      arm: 'west',
    },
    {
      id: 'int2_flow_w_s',
      phaseId: 3,
      name: 'Vest -> Sud (Dreapta)',
      d: 'M 20,560 Q 230,580 335,980',
      strokeWidth: 20,
      arm: 'west',
    },
  ],
};
