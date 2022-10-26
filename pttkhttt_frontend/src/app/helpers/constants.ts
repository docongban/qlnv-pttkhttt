export const PAGE_SIZE = 10;

export const ROLES = ["ROLE_ADMIN", "ROLE_GVCN", "ROLE_GVBM", "ROLE_TK", "ROLE_HP", "ROLE_HT", "ROLE_USER"];

export const ROLES_STUDENT_MANAGEMENT_FULL = ["ROLE_ADMIN", "ROLE_GVCN", "ROLE_HT"];
export const ROLES_STUDENT_MANAGEMENT = ["ROLE_GVBM", "ROLE_TK", "ROLE_HP"];

export const ROLES_TEACHER_MANAGEMENT = ["ROLE_TK", "ROLE_HP"];

export const EXTENSION_IMAGE = [".png", ".jpg", ".PNG", ".JPG"]

export const MAX_LENGTH_500 = 500
export const MAX_LENGTH_250 = 250
export const MAX_FILE_SIZE_UPLOAD = 5242880 // 5MB

export const KEYCODE_0 = 48
export const KEYCODE_9 = 57
export const KEYCODE_BACKSPACE = 8

export const TABLE_CELL_STYLE = {
  'font-weight': '500',
  'font-size': '12px',
  'font-family': 'Inter',
  'font-style': 'normal',
  'align-items': 'center',
  display: 'flex',
  displayce: 'nowrap',
  'text-overflow': 'ellipsis',
  overflow: 'hidden',
  padding: '10px',
  height: '100%',
}

export const NO_ROW_GRID_TEMPLATE = `
  <div>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.69873 25H30.2467V48H7.45215C6.98712 48 6.54113 47.8136 6.2123 47.4818C5.88347 47.15 5.69873 46.7 5.69873 46.2308V25Z" fill="#C1C4D6"/>
      <path d="M30.2466 25H42.5206V46.2308C42.5206 46.7 42.3358 47.15 42.007 47.4818C41.6782 47.8136 41.2322 48 40.7671 48H30.2466V25Z" fill="#8F95B2"/>
      <path d="M30.2466 25L35.726 31.1923H48L42.5206 25H30.2466Z" fill="#D8DAE5"/>
      <path d="M30.4658 25L24.9863 31.1923H0L5.47945 25H30.4658Z" fill="#D8DAE5"/>
      <path d="M24 20C29.5228 20 34 15.5228 34 10C34 4.47715 29.5228 0 24 0C18.4772 0 14 4.47715 14 10C14 15.5228 18.4772 20 24 20Z" fill="#C1C4D6"/>
      <path d="M23.7475 6.84449L24.0657 7.3131L24.3827 6.84449C24.5962 6.62203 24.8523 6.44481 25.1358 6.32338C25.4192 6.20196 25.7242 6.13881 26.0325 6.13771C26.3409 6.13661 26.6463 6.19756 26.9306 6.31696C27.2149 6.43635 27.4723 6.61173 27.6874 6.83266L27.7514 6.89359C28.2155 7.3479 28.4821 7.9666 28.4937 8.61593C28.5053 9.26526 28.2608 9.89307 27.8132 10.3636L27.7514 10.4267L24.0657 14.0274L20.4712 10.4267C20.2361 10.1965 20.0493 9.92169 19.9217 9.61834C19.7942 9.31499 19.7285 8.98923 19.7285 8.66017C19.7285 8.3311 19.7942 8.00534 19.9217 7.70199C20.0493 7.39864 20.2361 7.1238 20.4712 6.89359C20.6743 6.66067 20.9242 6.4731 21.2045 6.34306C21.4848 6.21301 21.7894 6.14342 22.0984 6.13879C22.4074 6.13416 22.7139 6.1946 22.998 6.31618C23.2821 6.43776 23.5375 6.61777 23.7475 6.84449Z" fill="white"/>
      <defs>
      <clipPath id="clip0">
      <rect width="48" height="48" fill="white"/>
      </clipPath>
      </defs>
    </svg>
    <p style='margin-top: 6px;'>{{field}}</p>
  </div>
`

export const REGEX_VIETNAMESE = /[ỹáàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ]/

export const STUDENTS = {
  STATUS: [
    { name: 'Đang học', id: 0, color: '#52BD94'},
    { name: 'Bảo lưu', id: 1, color: '#696F8C' },
    { name: 'Đã thôi học', id: 2, color: '#F26522' },
    { name: 'Đã chuyển trường', id: 3, color: '#D14343' },
  ],
  TRAINING_SYSTEM: [
    { name: 'Chính quy', id: 1 },
    { name: 'Tại chức', id: 2 },
    { name: 'Vừa học vừa làm', id: 3 },
    { name: 'Liên thông', id: 4 },
    { name: 'Đào tạo nghề', id: 5 },
    { name: 'Hợp tác đào tạo', id: 6 },
  ],
  SEX: [
    { name: 'Nam', id: 0 },
    { name: 'Nữ', id: 1 },
  ],
  ELECT_FORMAT: [
    { name: 'Xét tuyển', id: 0 },
    { name: 'Thi tuyển', id: 1 },
  ],
  GRADUATION_TYPE: [
    { name: 'Giỏi', id: 1 },
    { name: 'Khá', id: 2 },
    { name: 'Trung bình', id: 3 },
  ],
  RELATIONSHIP: [
    { name: 'Bố', id: 0 },
    { name: 'Mẹ', id: 1 },
    { name: 'Ông Bà', id: 2 },
    { name: 'Anh chị', id: 3 },
    { name: 'Cô chú', id: 4 },
    { name: 'Người giám hộ', id: 5 },
  ]
};

export const SCHOOL_YEAR = {

    MINIMUM_YEAR: 1000

}

export const TEACHER = {
  STATUS: [
    { name: 'Đang làm việc', id: 0, color: '#52BD94'},
    { name: 'Đã nghỉ việc', id: 1, color: '#D14343' },
    { name: 'Đã nghỉ hưu', id: 2, color: '#474D66' },
    { name: 'Tạm nghỉ', id: 3, color: '#F26522' },
  ]
}

export const INVALID = [null, undefined, '', 'null']

export const QUARTERS = [
  // mm-dd
  {
    id: 1,

    name: 'Quý I',
    translate: 'MENU.SUB_HEADER.QUARTER1',
    // name: 'I',
    fromDate: '01-01',
    toDate: '03-31',
    months: [1,2,3],

  },
  {
    id: 2,
    name: 'Quý II',
    translate: 'MENU.SUB_HEADER.QUARTER2',
    // name: 'II',
    fromDate: '04-01',
    toDate: '06-30',
    months: [4,5,6],

  },
  {
    id: 3,
    name: 'Quý III',
    translate: 'MENU.SUB_HEADER.QUARTER3',
    // name: 'III',
    fromDate: '07-01',
    toDate: '09-30',
    months: [7,8,9],

  },
  {
    id: 4,
    name: 'IV',
    fromDate: '10-01',
    toDate: '12-31',
    months: [10,11,12],
    translate: 'MENU.SUB_HEADER.QUARTER4',
  },
]

export const SUB_HEADER = {
  TYPE_MONTH : '0',
  TYPE_QUARTER: '1',
  TYPE_YEAR: '2',

  LIST_TYPE: [
    {
        id: 0,
        name: 'Tháng',
        translate: 'MENU.SUB_HEADER.MONTH',
        defaultSelect: true
    },
    {
        id: 1,
        name: 'Quý',
        translate: 'MENU.SUB_HEADER.QUARTER',
        defaultSelect: false
    },
    {
        id: 2,
        name: 'Năm',
        translate: 'MENU.SUB_HEADER.YEAR',
        defaultSelect: false
    }
  ],

  LIST_MONTH: [
    {
        id: 1,
        name: '1'
    },{
        id: 2,
        name: '2'
    },{
        id: 3,
        name: '3'
    },{
        id: 4,
        name: '4'
    },{
        id: 5,
        name: '5'
    },{
        id: 6,
        name: '6'
    },{
        id: 7,
        name: '7'
    },
    {
        id: 8,
        name: '8'
    },
    {
        id: 9,
        name: '9'
    },
    {
        id: 10,
        name: '10'
    },
    {
        id: 11,
        name: '11'
    },
    {
        id: 12,
        name: '12'
    }
  ]
}
