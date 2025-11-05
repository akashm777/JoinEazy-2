import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Plus, Edit, Trash2, Users, User, Calendar, ExternalLink, Filter, Search, ArrowLeft, FileText } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const AssignmentManagement = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [course, setCourse] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - replace with actual API calls
    const courseData = {
      1: {
        id: 1,
        name: 'Computer Science 101',
        code: 'CS101',
        semester: 'Fall 2024'
      },
      2: {
        id: 2,
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        semester: 'Fall 2024'
      },
      3: {
        id: 3,
        name: 'Database Management Systems',
        code: 'CS301',
        semester: 'Fall 2024'
      },
      4: {
        id: 4,
        name: 'Software Engineering',
        code: 'CS401',
        semester: 'Fall 2024'
      }
    }

    const mockCourse = courseData[parseInt(courseId)] || courseData[1]

    const assignmentsData = {
      1: [ // CS101 - Computer Science 101
        {
          id: 1,
          title: 'Introduction to Programming',
          description: 'Basic programming concepts and syntax',
          deadline: new Date('2024-12-15T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs101/assignment1',
          submissionType: 'individual',
          totalStudents: 45,
          submitted: 38,
          acknowledged: 35,
          createdAt: new Date('2024-11-01')
        },
        {
          id: 2,
          title: 'Basic Programming Exercises',
          description: 'Practice exercises covering loops, functions, and problem-solving',
          deadline: new Date('2024-12-20T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs101/assignment2',
          submissionType: 'individual',
          totalStudents: 45,
          submitted: 12,
          acknowledged: 10,
          createdAt: new Date('2024-11-10')
        }
      ],
      2: [ // CS201 - Data Structures & Algorithms
        {
          id: 3,
          title: 'Linked List Implementation',
          description: 'Implement singly and doubly linked lists with basic operations',
          deadline: new Date('2024-12-18T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs201/assignment1',
          submissionType: 'individual',
          totalStudents: 38,
          submitted: 25,
          acknowledged: 22,
          createdAt: new Date('2024-11-05')
        },
        {
          id: 4,
          title: 'Binary Tree Project',
          description: 'Design and implement binary search tree algorithms',
          deadline: new Date('2024-12-25T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs201/assignment2',
          submissionType: 'group',
          totalGroups: 10,
          submitted: 6,
          acknowledged: 4,
          createdAt: new Date('2024-11-12')
        }
      ],
      3: [ // CS301 - Database Management Systems
        {
          id: 5,
          title: 'Database Design Project',
          description: 'Design normalized database schema with ER diagrams',
          deadline: new Date('2024-12-22T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs301/assignment1',
          submissionType: 'group',
          totalGroups: 8,
          submitted: 7,
          acknowledged: 6,
          createdAt: new Date('2024-11-08')
        },
        {
          id: 6,
          title: 'SQL Query Optimization',
          description: 'Write and optimize complex SQL queries for performance',
          deadline: new Date('2024-12-28T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs301/assignment2',
          submissionType: 'individual',
          totalStudents: 32,
          submitted: 8,
          acknowledged: 6,
          createdAt: new Date('2024-11-15')
        }
      ],
      4: [ // CS401 - Software Engineering
        {
          id: 7,
          title: 'Requirements Analysis Document',
          description: 'Create comprehensive requirements analysis for web application',
          deadline: new Date('2024-12-20T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs401/assignment1',
          submissionType: 'group',
          totalGroups: 7,
          submitted: 3,
          acknowledged: 2,
          createdAt: new Date('2024-11-03')
        },
        {
          id: 8,
          title: 'Software Testing Plan',
          description: 'Develop complete testing strategy including unit and integration tests',
          deadline: new Date('2024-12-30T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs401/assignment2',
          submissionType: 'individual',
          totalStudents: 28,
          submitted: 5,
          acknowledged: 4,
          createdAt: new Date('2024-11-18')
        }
      ]
    }

    const mockAssignments = assignmentsData[parseInt(courseId)] || assignmentsData[1]

    setCourse(mockCourse)
    setAssignments(mockAssignments)
  }, [courseId])

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'individual') return matchesSearch && assignment.submissionType === 'individual'
    if (filter === 'group') return matchesSearch && assignment.submissionType === 'group'
    if (filter === 'pending') {
      const submissionRate = assignment.submissionType === 'individual' 
        ? assignment.submitted / assignment.totalStudents 
        : assignment.submitted / assignment.totalGroups
      return matchesSearch && submissionRate < 0.8
    }
    
    return matchesSearch
  })

  const handleCreateAssignment = (assignmentData) => {
    const newAssignment = {
      id: Date.now(),
      ...assignmentData,
      deadline: new Date(assignmentData.deadline),
      totalStudents: assignmentData.submissionType === 'individual' ? 45 : undefined,
      totalGroups: assignmentData.submissionType === 'group' ? 12 : undefined,
      submitted: 0,
      acknowledged: 0,
      createdAt: new Date()
    }
    
    setAssignments([...assignments, newAssignment])
    setShowCreateModal(false)
    toast.success('Assignment created successfully!')
  }

  const handleEditAssignment = (assignmentData) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === editingAssignment.id 
        ? { ...assignment, ...assignmentData, deadline: new Date(assignmentData.deadline) }
        : assignment
    ))
    setEditingAssignment(null)
    toast.success('Assignment updated successfully!')
  }

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId))
      toast.success('Assignment deleted successfully!')
    }
  }

  const getSubmissionProgress = (assignment) => {
    if (assignment.submissionType === 'individual') {
      return {
        submitted: assignment.submitted,
        total: assignment.totalStudents,
        percentage: (assignment.submitted / assignment.totalStudents) * 100
      }
    } else {
      return {
        submitted: assignment.submitted,
        total: assignment.totalGroups,
        percentage: (assignment.submitted / assignment.totalGroups) * 100
      }
    }
  }

  const AssignmentCard = ({ assignment }) => {
    const progress = getSubmissionProgress(assignment)
    const isOverdue = new Date() > assignment.deadline
    
    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{assignment.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  Due: {format(assignment.deadline, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              
              <div className="flex items-center">
                {assignment.submissionType === 'individual' ? (
                  <User className="w-4 h-4 mr-1" />
                ) : (
                  <Users className="w-4 h-4 mr-1" />
                )}
                <span className="capitalize">{assignment.submissionType}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Submission Progress</span>
                <span className="text-sm text-gray-600">
                  {progress.submitted}/{progress.total} ({Math.round(progress.percentage)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={assignment.oneDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                OneDrive Link
              </a>
            </div>
          </div>

          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => setEditingAssignment(assignment)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteAssignment(assignment.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
          <button
            onClick={() => navigate('/professor/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course?.name} - Assignments
              </h1>
              <p className="text-gray-600">{course?.code} • {course?.semester}</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Assignments</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="pending">Pending Submissions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first assignment to get started'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Assignment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Assignment Modal */}
      {(showCreateModal || editingAssignment) && (
        <AssignmentModal
          assignment={editingAssignment}
          onSave={editingAssignment ? handleEditAssignment : handleCreateAssignment}
          onClose={() => {
            setShowCreateModal(false)
            setEditingAssignment(null)
          }}
        />
      )}
    </div>
  )
}

const AssignmentModal = ({ assignment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    deadline: assignment?.deadline ? format(assignment.deadline, "yyyy-MM-dd'T'HH:mm") : '',
    oneDriveLink: assignment?.oneDriveLink || '',
    submissionType: assignment?.submissionType || 'individual'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                placeholder="Enter assignment description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OneDrive Link
              </label>
              <input
                type="url"
                required
                value={formData.oneDriveLink}
                onChange={(e) => setFormData({ ...formData, oneDriveLink: e.target.value })}
                className="input-field"
                placeholder="https://onedrive.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select
                value={formData.submissionType}
                onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                className="input-field"
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="submit" className="flex-1 btn-primary">
                {assignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AssignmentManagement