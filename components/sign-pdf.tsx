'use client'
'use dom'

import { useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocumentProxy } from 'pdfjs-dist'

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

 export default function SignPdfJs ({}: { dom: import('expo/dom').DOMProps }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
	const url = require("@/assets/pdfs/test.pdf")

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url)
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        
        const canvas = canvasRef.current
        if (!canvas) return
        
        const context = canvas.getContext('2d')
        const viewport = page.getViewport({ scale: 1.0 })
        
        canvas.height = viewport.height
        canvas.width = viewport.width
        
        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise

        // Get form fields
        const annotations = await page.getAnnotations()
				console.log(annotations)
        const formFields = annotations.filter(
          annotation => annotation.subtype === 'Widget'
        )

        // Create form elements for each field
        formFields.forEach(field => {
          const input = document.createElement('input')
          input.type = 'text' // or other types based on field.fieldType
          input.style.position = 'absolute'
          input.style.left = `${field.rect[0]}px`
          input.style.top = `${field.rect[1]}px`
          input.style.width = `${field.rect[2] - field.rect[0]}px`
          input.style.height = `${field.rect[3] - field.rect[1]}px`
          
          canvasRef.current?.appendChild(input)
        })
      } catch (error) {
        console.error('Error loading PDF:', error)
      }
    }

    loadPDF()
  }, [url])

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  )
}
