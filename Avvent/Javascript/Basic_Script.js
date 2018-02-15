/*
ToDo
========
Create notify system
Project bar
	use tokens:
		add member
		add task
		complete a task
personal tasks bar
	priorities
	complete task

*/


$(document).ready(function(){
	$('.ui.menu .dropdown').dropdown({on:'hover',direction: 'upward',transition:'scale', action:'hide', keepOnScreen:'true'});
	$('#tgLst').dropdown();
	$('#rmmbr').checkbox();
	$('#postUpdteFrm').form({on:'blur',fields:{Select:'empty',Title:'empty',Text:'empty',Date:'empty'}});
	$('#loginFrm').form({on:'blur',fields:{username:'empty',password:'empty'}});
	$('#regFrm').form({on:'blur',fields:{username:'empty',password:'empty',firstName:'empty',lastName:'empty',email:'empty'}});
	window.addEventListener( 'resize', NavSetup, false );
	Initialized();
});

var infoBar, recruitment, allUpdatesCard, closeNum, calBar, token, username, firstname, lastname, userRole, userID, chatroomApp, ganttChart, universal;
var offsetPosts = 0;

function Initialized() {

	universal = new Vue({
		methods:{
			Toggle:function(toggle) {
				var w = window.innerWidth;
				var h = window.innerHeight;

				switch (toggle){
					case 'infoBar':
						if (infoBar.showBar) {
							infoBar.showBar = false
						} else {
							if (ganttChart.showBar && w <970) {
								ganttChart.showBar = false;
								infoBar.showBar = true;
							} else {
								infoBar.showBar = true;
							}
						}
						break;

					case 'ganttChart':
						if (ganttChart.showBar) {
							ganttChart.projectDuration = 0;
							ganttChart.allProjects = [];
							ganttChart.isProjectAdmin = false;
							ganttChart.isProjectMember = false;
							ganttChart.showBar = false;
							
						} else {
							if (w < 660 || h < 460) {
								alert('Sorry, screen size is to small')
							} else {
								if (infoBar.showBar && w < 970) {
									infoBar.showBar = false;
									ganttChart.showBar = true;
								} else {
									ganttChart.showBar = true;
								}
							}
						}
						break;
				}
			},
			windowResize:function() {
				var w = window.innerWidth;
				var h = window.innerHeight;

				if (infoBar.showBar) {
					if (w < 970) {
						ganttChart.projectDuration = 0;
						ganttChart.allProjects = [];
						ganttChart.isProjectAdmin = false;
						ganttChart.isProjectMember = false;
						ganttChart.showBar = false;
					}
				} else {
					if (ganttChart.showBar) {
						if (w < 660) {
							ganttChart.projectDuration = 0;
							ganttChart.allProjects = [];
							ganttChart.isProjectAdmin = false;
							ganttChart.isProjectMember = false;
							ganttChart.showBar = false;
						}
					}
				}
			}
		}
	});
	
	infoBar = new Vue({
		el: '#profileInfo',
		data: {
			appName: 'infoBar',
			showBar: true,

			//Post Data
			tag1:'',
			title1: '',
			postText1: '',
			postDate1: '',

			tag2:'',
			title2: '',
			postText2: '',
			postDate2: '',

			tag3:'',
			title3: '',
			postText3: '',
			postDate3: '',

			//UI Updates
			isLoading: false,
			showReading: false,
			readingText:'',
			readingTitle:'',
			readingDate:'',
			readingTag:'',

		},
		mounted:function () {
			this.$nextTick(function() {
				getUpdates();
			})
		},
		methods: {
			Toggle:function() {
				//Get avaliable screen size
				universal.Toggle(this.appName);
				
			},

			ReadingBar: function (expression) {
				//alert("s");
				switch(expression){
					case 1:
						this.readingText = this.postText1;
						this.readingTitle = this.title1;
						this.readingDate = this.postDate1;
						this.readingTag = this.tag1;
						break;

					case 2:
						this.readingText = this.postText2;
						this.readingTitle = this.title2;
						this.readingDate = this.postDate2;
						this.readingTag = this.tag2;
						break;

					case 3:
						this.readingText = this.postText3;
						this.readingTitle = this.title3;
						this.readingDate = this.postDate3;
						this.readingTag = this.tag3;
						break;
				}


				this.showReading = true;
			}
		}	
	});

	ganttChart = new Vue({
		el:'#gntChrt',
		data:{
			appName:'ganttChart',
			allProjects:[],
			project:{
				projectID:'',
				projectName:'',
				projectDescription:'',
				projectAdmin:'',
				participants:[],
				tasks:[]
			},
			//Data about the project
			lastDay: 0,
			startDay: 0,
			projectDuration: 0,
			dayLength: 30,

			//data about the user
			isProjectMember: false,
			isProjectAdmin: false,

			//Currently viewed task
			curTitle:'',
			curDescription:'',
			curDuration:'',
			curEndDate:'',
			curID:'',

			completedProject:false,

			showBar:false
		},
		watch:{
			dayLength:function() {
				this.ProjectSetup();
			}
		},
		methods:{
			ProjectSetup:function() {

				this.lastDay = 0;
				this.startDay = 0;
				
				$('#noProjectContainer').css('display','none');

				if (this.project.tasks.length == 0) {
					var tempDate = new Date()
					this.startDay = tempDate.getTime();
					this.lastDay  = this.startDay + (14*1000*60*60*24);
					this.completedProject = true;
					this.projectDuration = (new Date(this.lastDay).getTime() - new Date(this.startDay).getTime()) /(1000*60*60*24);

					var tasks_tab_length = this.projectDuration * this.dayLength;
					$('#project_task_complete').width(tasks_tab_length);
					$('#project_task_whole').width(tasks_tab_length);
					
				} else {
					//get the last day
					for (var i = this.project.tasks.length - 1; i >= 0; i--) {
						var tempDate = new Date(Date.parse(this.project.tasks[i].endDate));
						if (tempDate.getTime() > this.lastDay) {
							this.lastDay = tempDate.getTime();
							this.startDay = tempDate.getTime();
						}
					}
					
					//get the start day
					for (var i = this.project.tasks.length - 1; i >= 0; i--) {
						var tempDate = new Date(Date.parse(this.project.tasks[i].endDate));
						var beforeTempDate = new Date(tempDate.getTime() - (this.project.tasks[i].duration * 1000*60*60*24));
						if (beforeTempDate.getTime() < this.startDay) {
							this.startDay = beforeTempDate.getTime();
						}
					}
					//set project length
					this.projectDuration = (new Date(this.lastDay).getTime() - new Date(this.startDay).getTime()) /(1000*60*60*24);
					var tasks_tab_length = this.projectDuration * this.dayLength;
					$('#project_task_whole').width(tasks_tab_length);
					this.completedProject = false;
				}
			},
			calcLeft: function(dur, endD) {
				var tempDateEnd = new Date(Date.parse(endD));
				return (tempDateEnd.getTime() - this.startDay - (dur*1000*60*60*24))/(1000*60*60*24)*this.dayLength + "px";
			},
			calcWidth: function(dur) {
				return (dur*this.dayLength) + "px";
			},
			GetDateDay: function(mul) {
				var curDate= new Date(this.startDay + (mul*1000*60*60*24));
				
				return curDate.getDate();
			},
			GetDateMonth:function (mul) {
				var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
				var curDate= new Date(this.startDay + (mul*1000*60*60*24));

				return months[curDate.getMonth()];
			},
			showMonthToolTip: function(mul) {
				var curDate = new Date(this.startDay + (mul*1000*60*60*24));
				var testMonth = curDate.getDate();
				if (mul == 1) {
					return true;
				} else if (testMonth == 1) {
					return true;
				}
				else{
					return false;
				}
			},
			showDay:function() {
				if (this.dayLength < 30) {
					return false;
				} else {
					return true;
				}
			},
			OpenTaskDef:function (ID, title, description,endDate,duration) {
				$('#viewTask').dimmer({closable:false}).dimmer('show');
				this.curID = ID;
				this.curTitle = title;
				this.curDescription = description;
				this.curEndDate = endDate;
				this.curDuration = duration;
			},
			ViewAllProjects: function () {
				
				var offsetLength = this.allProjects.length;

				//$post function comes here
				var posting = $.post("PHP_Files/ProjectsApp/GetProjects.php",{Offset:offsetLength} ,function(data) {
					var parsedData = JSON.parse(data);
					if (data == '404') {
						alert('No more projects to load.')
					} else {
						for (var i = parsedData.length - 1; i >= 0; i--) {
							ganttChart.allProjects.push(parsedData[i]);
						}
					}
					$('#allProjects').dimmer({closable:false}).dimmer('show');
					$('#btn4').removeClass('loading');
					$('#btn5').removeClass('loading');
				});
				posting.fail(function (data) {
					alert('Oops, something went wrong: '+ data);
					$('#btn4').removeClass('loading');
					$('#btn5').removeClass('loading');
				})
			},
			ViewProject:function(projectID) {
				var posting = $.post("PHP_Files/ProjectsApp/GetProjectData.php", {ProjectID:projectID}, function(data) {
					if (data == '404' || data == '') {
						alert("error");
					} else {
						
						ganttChart.allProjects = [];

						var parsedData = JSON.parse(data);

						ganttChart.project.projectID = parsedData.ID;
						ganttChart.project.projectName = parsedData.projectName;
						ganttChart.project.projectDescription = parsedData.description;
						ganttChart.project.projectAdmin = parsedData.projectAdminID;
						ganttChart.project.tasks = parsedData.tasks;
						ganttChart.project.participants = parsedData.participants;
						ganttChart.ProjectSetup();
						$('#allProjects').dimmer('hide');

						if (parsedData.projectAdminID == userID) {
							ganttChart.isProjectAdmin = true;
						} else {
							ganttChart.isProjectAdmin = false;
							for (var i = parsedData.participants.length - 1; i >= 0; i--) {
								if (parsedData.participants[i].participantsID == userID) {
									ganttChart.isProjectMember = true;
								}
							}
						}
					}
				});
				posting.fail(function(data) {
					alert('Oops, something went wrong: ' + data);
				});
			},
			CloseProjectDimmer:function() {
				this.allProjects = [];
				$('#allProjects').dimmer('hide');
			},
			GanttState: function() {
				if (!showBar) {
					$('#noProjectContainer').css('display','block');
				}
			},
			Toggle:function() {
				universal.Toggle(this.appName);
			}
		}
	});

	allUpdatesCard = new Vue({
		el:'#crd2',
		data:{
			Posts:[]
		}
	});

	window.addEventListener( 'resize', universal.windowResize, false );
	NavSetup();
}

//Navigation
//=====================================
function NavSetup() {
	var w = window.innerWidth;
	
	//navigation
	if (w < 460) {
		$('#mobileNavigatorContainer').css('display', 'block');
		$('#navigatorContainer').css('display', 'none');
	} else {
		$('#navigatorContainer').css('display', 'flex');
		$('#mobileNavigatorContainer').css('display', 'none');
		$('#mobileNav').removeClass('bounceInUp').addClass('bounceOutDown');
		$('#mobileNav').css('display', 'none');
	}
}

function MobileNav() {

	if ($('#mobileNav').css('display') == "block") {
		$('#mobileNav').removeClass('bounceInUp').addClass('bounceOutDown');
		
		$('#mobileNav').css('display', 'none');
		
	} else {
		$('#mobileNav').removeClass('bounceOutDown').addClass('bounceInUp');
		$('#mobileNav').css('display', 'block');
	}	
}

function HideMobileNave() {
	$('#mobileNav').removeClass('bounceInUp').addClass('bounceOutDown');
	
	$('#mobileNav').css('display', 'none');	
}
//=====================================

//Pages
//=====================================
function GoToModal(ID, number) {

	setTimeout(function(e) {
		$('#modl').modal('setting', 'closable', false).modal('show');
	},500);

	$('#artcles').load('Crds/' + ID + '.txt', function (response, status, xhr) {
		if (status == 'error') {
			setTimeout(function() {
				$('#modl').modal('hide');
				GoToOrigin(window['dot' + closable].x,window['dot' + closable].y,window['dot' + closable].z,closable);
			}, 2000)
		}
		else{
			setTimeout(function() {
				$('#modl .segment').removeClass('loading');
				$('#modl').modal('refresh');
			},0)
			
		}
	});

	closable = number;
}

function CloseModl() {
	GoToOrigin(window['dot' + closable].x,window['dot' + closable].y,window['dot' + closable].z,closable);
	$('#modl').modal('hide');

	$('#artcles').addClass('loading');
	$('#artcles').empty();
}

function GoToMiniModal(ID) {
	setTimeout(function () {
		$('#' + ID).modal('setting', 'closable', false).modal('show');
	}, 500)
}
//=====================================

//Updates functions
//=====================================
function getUpdates() {

	var splitD, dataSet1, dataSet2, dataSet3;

	infoBar.isLoading = true;

	var posting = $.post( "PHP_Files/Updates.php", function( data ) {
		splitD = data.split(";");
		dataSet1 = splitD[0].split("|");
		dataSet2 = splitD[1].split("|");
		dataSet3 = splitD[2].split("|");

		
		
		infoBar.tag1 = dataSet1[1];
		infoBar.title1 = dataSet1[2];
		infoBar.postText1 = dataSet1[3];
		infoBar.postDate1 = dataSet1[4];

		infoBar.tag2 = dataSet2[1];
		infoBar.title2 = dataSet2[2];
		infoBar.postText2 = dataSet2[3];
		infoBar.postDate2 = dataSet2[4];

		infoBar.tag3 = dataSet3[1];
		infoBar.title3 = dataSet3[2];
		infoBar.postText3 = dataSet3[3];
		infoBar.postDate3 = dataSet3[4];
		infoBar.isLoading = false;
	});

	posting.fail(function () {
		infoBar.isLoading = false;
		alert('Oops, something went wrong: ' + data);
	});
}

function getAllUpdates() {
	var posting = $.post("PHP_Files/AllUpdates.php",{offset: offsetPosts}, function (data) {
		
		var firstSplit,secondSplit;

		if (data == "Error 404") {
			alert("Error 404");
		} else {
			firstSplit = data.split(';');
			
			//Subtracting 2 to composate for the emtpy last object and arrays indexes
			for (var i = 0; i <= firstSplit.length - 2; i++) {
				secondSplit = firstSplit[i].split('|');
				var tempObj = {
					ID: secondSplit[0],
					Tag: secondSplit[1],
					Title: secondSplit[2],
					Text: secondSplit[3],
					Date: secondSplit[4]
				}
				allUpdatesCard.Posts.push(tempObj);
			}
			offsetPosts += 4;
		}
	});
	posting.fail(function (data) {
		alert('Oops, something went wrong: ' + data);
	});
	posting.done(function() {
		setTimeout(function() {
			$('#crd2').modal('refresh');
		},0);
		
	})
}

//=====================================

//misc
//=====================================
function startPageAt() {

	var expression = window.location.hash


	switch(expression){

	//#1 is Basic plan
	case "#1":
		GoToCenter(dot6.x,dot6.y,dot6.z,6); GoToModal('crd6', 6);
		break;

	case "#2":
		GoToCenter(dot8.x,dot8.y,dot8.z,8); GoToModal('crd8', 8);
		break;
	case "#reg":
		GoToCenter(dot4.x,dot4.y,dot4.z,4); GoToMiniModal('crd4');
	}

	window.location.hash = "";
}
