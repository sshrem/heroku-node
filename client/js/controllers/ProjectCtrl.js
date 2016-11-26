'use strict';

angular.module('DisignStudio')
  .controller('ProjectCtrl', function($rootScope,Cloudinary, $scope, $state, $http) {

    angular.element(document).ready(function () {
      $('.modal-trigger').leanModal();
      $('ul.tabs').tabs();
      $('.slider').slider({full_width: false});
    });

    $scope.projectCode = 3;
    $scope.project;
    $scope.apartments;
    $scope.selectedApartment;

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/project';

    var buildApartmentsArray = function(){
      $scope.apartments = $scope.project.apartmentTemplateCachedData;
    }

    $scope.openApartmentModal = function(aptTemplate){
      $scope.selectedApartment = aptTemplate;
      $('#AptModal').openModal();
    }

    $scope.openProjectModal = function(){
      $('#projectModal').openModal();
    }

    function init() {
      if ($rootScope.isDebugMode) {
        $scope.project = {
          "title": "חלומות פרדס חנה - כרכור",
          "about": "<p>שיכון ובינוי נדלן ממשיכה את תנופת ההצלחה במושבה הירוקה ומזמינה אתכם לחוויית מגורים מיוחדת במינה.</p>\n<p> בואו ליהנות מפרויקט מתקדם בסטנדרט גבוה, הממוקם ליד ספריית היישוב ומציע גני שעשועים מתחת לבית, בתי ספר קרובים, מגוון רחב של אפשרויות תעסוקה קנייה ובילוי במרחק נסיעה קצרה והכל במרחק 3 דקות נסיעה מהרכבת ומהיציאה לכביש החוף ו - 6 דקות מכביש 6. </p>הפרויקט נבנה על פי עקרונות הבנייה הירוקה ומקבל תקן ישראלי ממכון התקנים. בפרויקט מתוכננים 8 בניינים, לרשותכם מגוון דירות רחב.",
          "logo": "projects/shikunbinuidpchk/project-logo.png",
          "image": "projects/shikunbinuidpchk/background.jpg",
          "entrepreneurCachedData": {
            "logo": "entrepreneurs/shikunvebinui-logo.png",
            "about": "<p>שיכון ובינוי נדל”ן הינה חברת הנדל”ן הגדולה בישראל הנהנית מחוסן כלכלי ומצמיחה מתמדת.</p>\n\n<p>החברה הינה הזרוע היזמית של קבוצת שיכון ובינוי, שבשנת 2011 קבעו סקרי BDI ו-B&D כי היא חברת התשתיות והנדל”ן המובילה בישראל.</p>\n\n<p> החברה הוקמה לפני 90 שנה ועד היום בנתה מעל 185,000 יחידות דיור בכל רחבי הארץ ליותר ממיליון איש.\n מאז נוסדה, פועלת החברה מתוך חזון לבניית הארץ, ועושה זאת בהצלחה רבה ובהתאמה לצרכים המשתנים של האוכלוסייה.</p>\n\n<p> שיכון ובינוי נדל”ן מגשימה לאורך השנים חלומות של משפחות רבות באמצעות הקמת סביבת מגורים משפחתית מושלמת, ומקימה את שכונותיה החדשות בגישה נוחה לכבישים מרכזיים כמו כביש 6 ולתחנות רכבת, והופכת את מרכז הארץ לנגיש במיוחד. שיכון ובינוי נדל”ן מעודדת חיי קהילה פעילים בשכונותיה ומשתפת פעולה עם תושבי השכונה, עוד אחד מהיתרונות שהופכים את שכונות החלומות שלה למבוקשות ביותר בארץ.</p>\n\n <p>חברת שיכון ובינוי נדל”ן מובילה את הבנייה הירוקה בישראל, והיא הראשונה שקיבלה הלכה למעשה תו תקן ירוק 5281 לבנייה רוויה בגמר בנייה. כחלק מקבוצת שיכון ובינוי, דוגלת החברה בעקרונות הקיימות, ובכל הפרויקטים שלה ברחבי הארץ היא בונה עפ”י תקנים לבנייה ירוקה. האלמנטים הירוקים בפרויקט כוללים: צמחייה חסכונית במים בגינון, הכנה להפרדת סוגי פסולת, בידוד אקוסטי ותרמי משופר, זיגוג LOW-E בדירות הפונות לדרום, פאנל מרכזי בכניסה לדירה להדלקה וכיבוי של תאורה ומזגן, הכנה למאווררי תקרה בשני חדרים, מערכת להגנה מנזקי האבנית בצנרת אספקת המים, חסכמים בברזים והכנה לחימום מים בגז. </p>"
          },
          "features": [
            "לובי כניסה מעוצב",
            "פרקט למינציה בחדר שינה הורים",
            "אינטרקום טלוויזיה במעגל סגור",
            "ריצוף פורצלן בסלון, מטבח ומעברים וחדרי שינה 60*60",
            "הכנה למזגן מיני מרכזי",
            "תריס חשמלי בסלון",
            "ארון מטבח עליון + תחתון",
            "משטח \"אבן קיסר\" במטבח",
            "ארון בחדר אמבטיה ",
            "כיור אקרילי במטבח הכנה למדיח כלים",
            "נקודת טלפון וטלוויזיה בכל חדר",
            "הכנה למערכת קולנוע ביתית",
            "חניה צמודה לכל דירה",
            "מחסן לכל דירה"
          ],
          "apartmentTemplateCachedData": [{
            "code": 1,
            "name": "דירת 5 חדרים | טיפוס A1",
            "imgCode": "projects/shikunbinuidpchk/plan_A1"
          }, {
            "code": 2,
            "name": "דירת 5 חדרים | טיפוס A2",
            "imgCode": "projects/shikunbinuidpchk/plan_A2.png"
          }, {
            "code": 3,
            "name": "דירת 4 חדרים | טיפוס B1",
            "imgCode": "projects/shikunbinuidpchk/plan_B1.png"
          }, {
            "code": 4,
            "name": "דירת 4 חדרים | טיפוס B2",
            "imgCode": "projects/shikunbinuidpchk/plan_B2.png"
          }, {
            "code": 5,
            "name": "מיני פנטהאוז 5 חדרים | טיפוס MPH1 ",
            "imgCode": "projects/shikunbinuidpchk/plan_MPH1.png"
          }, {
            "code": 6,
            "name": "מיני פנטהאוז 5 חדרים | טיפוס MPH2 ",
            "imgCode": "projects/shikunbinuidpchk/plan_MPH2.png"
          }, {
            "code": 7,
            "name": "מיני פנטהאוז 5 חדרים | טיפוס MPH3 ",
            "imgCode": "projects/shikunbinuidpchk/plan_MPH3.png"
          }, {
            "code": 8,
            "name": "פנטהאוז 5 חדרים | טיפוס PH1",
            "imgCode": "projects/shikunbinuidpchk/plan_PH1.png"
          }, {
            "code": 9,
            "name": "פנטהאוז 5 חדרים | טיפוס PH2",
            "imgCode": "projects/shikunbinuidpchk/plan_PH2.png"
          }]
        }
        buildApartmentsArray();
      } else {
        $http.get(initRequestUrl, {
          params: {
            code: $scope.projectCode
          }
        }).success(function(res) {
          if (res.data) {
            $scope.project = res.data;
            buildApartmentsArray();
          }
        }).error(function(e) {
          //
        });
      }

    }

    init();
  })
