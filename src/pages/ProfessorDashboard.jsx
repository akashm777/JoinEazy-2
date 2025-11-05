import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { BookOpen, Users, FileText, Calendar, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfessorDashboard = () => {
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCourses = [
      {
        id: 1,
        name: 'Computer Science 101',
        code: 'CS101',
        semester: 'Fall 2024',
        students: 45,
        assignments: 2,
        pendingSubmissions: 7,
        color: 'bg-blue-500'
      },
      {
        id: 2,
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        semester: 'Fall 2024',
        students: 38,
        assignments: 2,
        pendingSubmissions: 17,
        color: 'bg-green-500'
      },
      {
        id: 3,
        name: 'Database Management Systems',
        code: 'CS301',
        semester: 'Fall 2024',
        students: 32,
        assignments: 2,
        pendingSubmissions: 26,
        color: 'bg-purple-500'
      },
      {
        id: 4,
        name: 'Software Engineering',
        code: 'CS401',
        semester: 'Fall 2024',
        students: 28,
        assignments: 2,
        pendingSubmissions: 24,
        color: 'bg-orange-500'
      }
    ]

    setCourses(mockCourses)
    
    // Calculate stats
    const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0)
    const totalAssignments = mockCourses.reduce((sum, course) => sum + course.assignments, 0)
    const pendingSubmissions = mockCourses.reduce((sum, course) => sum + course.pendingSubmissions, 0)
    
    setStats({
      totalCourses: mockCourses.length,
      totalStudents,
      totalAssignments,
      pendingSubmissions
    })
  }, [])

  const handleCourseClick = (courseId) => {
    navigate(`/professor/course/${courseId}/assignments`)
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

  const CourseCard = ({ course }) => (
    <div 
      className="card clickable hover:scale-105 transform transition-all duration-200 hover:shadow-lg"
      onClick={() => handleCourseClick(course.id)}
    >
      <div className="flex items-start justify-between">
        <div className={`w-4 h-4 rounded-full ${course.color} flex-shrink-0 mt-1`}></div>
        <div className="flex-1 ml-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{course.code} • {course.semester}</p>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-lg font-bold text-gray-900">{course.students}</span>
              </div>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FileText className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-lg font-bold text-gray-900">{course.assignments}</span>
              </div>
              <p className="text-xs text-gray-500">Assignments</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-lg font-bold text-orange-600">{course.pendingSubmissions}</span>
              </div>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professor Dashboard</h1>
          <p className="text-gray-600">Manage your courses and track assignment progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.totalCourses}
            color="bg-blue-500"
            subtitle="Active this semester"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="bg-green-500"
            subtitle="Across all courses"
          />
          <StatCard
            icon={FileText}
            title="Total Assignments"
            value={stats.totalAssignments}
            color="bg-purple-500"
            subtitle="Created this semester"
          />
          <StatCard
            icon={TrendingUp}
            title="Pending Reviews"
            value={stats.pendingSubmissions}
            color="bg-orange-500"
            subtitle="Awaiting your review"
          />
        </div>

        {/* Courses Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('Create New Assignment clicked')
                if (courses.length > 0) {
                  toast.success('Navigating to assignment management...')
                  setTimeout(() => {
                    navigate(`/professor/course/${courses[0].id}/assignments`)
                  }, 500)
                } else {
                  toast.error('No courses available. Please create a course first.')
                }
              }}
              className="btn-primary"
            >
              Create New Assignment
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('View All Submissions clicked')
                toast.success('View All Submissions clicked! Feature coming soon!')
              }}
              className="btn-secondary"
            >
              View All Submissions
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault()
                console.log('Export Reports clicked')
                toast.success('Export Reports clicked! Feature coming soon!')
              }}
              className="btn-secondary"
            >
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessorDashboard