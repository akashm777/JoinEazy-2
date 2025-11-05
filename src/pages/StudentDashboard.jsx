import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar, Users } from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const [courses, setCourses] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0
  })
  const navigate = useNavigate()

  const loadCourseData = () => {
    // Mock data - replace with actual API calls
    const baseCourses = [
      {
        id: 1,
        name: 'Computer Science 101',
        code: 'CS101',
        semester: 'Fall 2024',
        professor: 'Dr. John Smith',
        assignments: 2,
        completed: 1,
        pending: 1,
        color: 'bg-blue-500'
      },
      {
        id: 2,
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        semester: 'Fall 2024',
        professor: 'Dr. Sarah Johnson',
        assignments: 2,
        completed: 0,
        pending: 2,
        color: 'bg-green-500'
      },
      {
        id: 3,
        name: 'Database Management Systems',
        code: 'CS301',
        semester: 'Fall 2024',
        professor: 'Dr. Michael Brown',
        assignments: 2,
        completed: 1,
        pending: 1,
        color: 'bg-purple-500'
      },
      {
        id: 4,
        name: 'Software Engineering',
        code: 'CS401',
        semester: 'Fall 2024',
        professor: 'Dr. Emily Davis',
        assignments: 2,
        completed: 0,
        pending: 2,
        color: 'bg-orange-500'
      }
    ]

    // Update course progress from localStorage
    const mockCourses = baseCourses.map(course => {
      const courseProgressKey = `course_progress_${course.id}`
      const savedProgress = localStorage.getItem(courseProgressKey)
      
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress)
        return {
          ...course,
          assignments: progressData.assignments || course.assignments,
          completed: progressData.completed || course.completed,
          pending: progressData.pending || course.pending
        }
      }
      
      return course
    })

    return mockCourses
  }

  useEffect(() => {
    const mockCourses = loadCourseData()

    const mockUpcomingDeadlines = [
      {
        id: 1,
        title: 'Algorithm Analysis',
        course: 'CS201',
        deadline: new Date('2024-12-15T23:59:00'),
        type: 'individual',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Database Project',
        course: 'CS301',
        deadline: new Date('2024-12-18T23:59:00'),
        type: 'group',
        status: 'in-progress'
      },
      {
        id: 3,
        title: 'Software Design Document',
        course: 'CS401',
        deadline: new Date('2024-12-20T23:59:00'),
        type: 'individual',
        status: 'pending'
      }
    ]

    setCourses(mockCourses)
    setUpcomingDeadlines(mockUpcomingDeadlines)
    
    // Calculate stats
    const totalAssignments = mockCourses.reduce((sum, course) => sum + course.assignments, 0)
    const completedAssignments = mockCourses.reduce((sum, course) => sum + course.completed, 0)
    const pendingAssignments = mockCourses.reduce((sum, course) => sum + course.pending, 0)
    
    setStats({
      totalCourses: mockCourses.length,
      totalAssignments,
      completedAssignments,
      pendingAssignments
    })

    // Add event listener to refresh data when window gains focus
    const handleFocus = () => {
      const updatedCourses = loadCourseData()
      setCourses(updatedCourses)
      
      // Recalculate stats
      const totalAssignments = updatedCourses.reduce((sum, course) => sum + course.assignments, 0)
      const completedAssignments = updatedCourses.reduce((sum, course) => sum + course.completed, 0)
      const pendingAssignments = updatedCourses.reduce((sum, course) => sum + course.pending, 0)
      
      setStats({
        totalCourses: updatedCourses.length,
        totalAssignments,
        completedAssignments,
        pendingAssignments
      })
    }

    // Add event listener for assignment progress updates
    const handleProgressUpdate = (event) => {
      handleFocus() // Reuse the same refresh logic
      
      // Show a subtle notification that progress was updated
      if (event.detail) {
        toast.success(`Progress updated! ${event.detail.completedCount}/${event.detail.totalCount} assignments completed`)
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('assignmentProgressUpdated', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('assignmentProgressUpdated', handleProgressUpdate)
    }
  }, [])

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}/assignments`)
  }

  const getDeadlineStatus = (deadline) => {
    const now = new Date()
    const threeDaysFromNow = addDays(now, 3)
    
    if (isBefore(deadline, now)) {
      return { status: 'overdue', color: 'text-red-600', bgColor: 'bg-red-50' }
    } else if (isBefore(deadline, threeDaysFromNow)) {
      return { status: 'urgent', color: 'text-orange-600', bgColor: 'bg-orange-50' }
    } else {
      return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-50' }
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="card hover:scale-105 transform transition-all duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const CourseCard = ({ course }) => {
    const completionRate = (course.completed / course.assignments) * 100
    
    return (
      <div 
        className="card clickable hover:scale-105 transform transition-all duration-200 hover:shadow-lg"
        onClick={() => handleCourseClick(course.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-4 h-4 rounded-full ${course.color} flex-shrink-0 mt-1`}></div>
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{course.code} • {course.semester}</p>
            <p className="text-xs text-gray-500 mb-3">Prof. {course.professor}</p>
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {course.completed}/{course.assignments} ({Math.round(completionRate)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>{course.completed} Completed</span>
              </div>
              <div className="flex items-center text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.pending} Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const DeadlineCard = ({ deadline }) => {
    const deadlineStatus = getDeadlineStatus(deadline.deadline)
    
    return (
      <div className={`p-4 rounded-lg border ${deadlineStatus.bgColor} border-gray-200`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{deadline.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{deadline.course}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className={`flex items-center ${deadlineStatus.color}`}>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{format(deadline.deadline, 'MMM dd, HH:mm')}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                {deadline.type === 'individual' ? (
                  <Users className="w-4 h-4 mr-1" />
                ) : (
                  <Users className="w-4 h-4 mr-1" />
                )}
                <span className="capitalize">{deadline.type}</span>
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            {deadline.status === 'pending' && (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            {deadline.status === 'in-progress' && (
              <Clock className="w-5 h-5 text-blue-500" />
            )}
            {deadline.status === 'completed' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your assignments and course progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Enrolled Courses"
            value={stats.totalCourses}
            color="bg-blue-500"
            subtitle="This semester"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={stats.completedAssignments}
            color="bg-green-500"
            subtitle="Assignments done"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={stats.pendingAssignments}
            color="bg-orange-500"
            subtitle="Need attention"
          />
          <StatCard
            icon={AlertCircle}
            title="Total Assignments"
            value={stats.totalAssignments}
            color="bg-purple-500"
            subtitle="Across all courses"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <DeadlineCard key={deadline.id} deadline={deadline} />
              ))}
            </div>
            
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming deadlines!</p>
                <p className="text-sm text-gray-500">You're all caught up</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('View All Assignments clicked')
                if (courses.length > 0) {
                  toast.success('Navigating to assignments...')
                  setTimeout(() => {
                    navigate(`/student/course/${courses[0].id}/assignments`)
                  }, 500)
                } else {
                  toast.error('No courses available. Please enroll in a course first.')
                }
              }}
              className="btn-primary"
            >
              View All Assignments
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('Join Study Group clicked')
                toast.success('Join Study Group clicked! Feature coming soon!')
              }}
              className="btn-secondary"
            >
              Join Study Group
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('Download Resources clicked')
                toast.success('Download Resources clicked! Feature coming soon!')
              }}
              className="btn-secondary"
            >
              Download Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard