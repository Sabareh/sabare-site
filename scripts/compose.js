#!/usr/bin/env node

// Simple script to create a new blog post with proper front matter
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const { execSync } = require('child_process')

const root = process.cwd()
const dataFolder = path.join(root, 'data')
const blogFolder = path.join(dataFolder, 'blog')

// Check if the blog folder exists, create it if not
if (!fs.existsSync(blogFolder)) {
  fs.mkdirSync(blogFolder, { recursive: true })
}

const getCurrentDate = () => {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'Enter post title:',
    validate: (input) => {
      if (input.length === 0) {
        return 'Title is required'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'summary',
    message: 'Enter post summary:',
  },
  {
    type: 'input',
    name: 'tags',
    message: 'Enter tags (comma separated):',
  },
]

inquirer.prompt(questions).then((answers) => {
  const { title, summary, tags } = answers
  
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
  
  const date = getCurrentDate()
  const filePath = path.join(blogFolder, `${slug}.mdx`)
  
  // Format tags
  const tagArray = tags
    ? tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
    : []
  
  const content = `---
title: '${title}'
date: '${date}'
tags: [${tagArray.map(t => `'${t}'`).join(', ')}]
draft: false
summary: '${summary || ''}'
---

## Introduction

Write your post content here.

`

  fs.writeFileSync(filePath, content)
  console.log(`Post created successfully at ${filePath}`)
  
  // Try to open the file in the default editor
  try {
    const editor = process.env.EDITOR || 'code'
    execSync(`${editor} ${filePath}`)
  } catch (error) {
    console.log(`File created. Open it manually to start editing.`)
  }
})