'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { useCallback, useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

/* ── SVG icon helpers ─────────────────────────────── */
const Icon = ({ d, size = 14 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  undo:        'M3 7v6h6M3.51 15a9 9 0 1 0 .49-3.96',
  redo:        'M21 7v6h-6M20.49 15a9 9 0 1 1-.49-3.96',
  bold:        'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  italic:      'M19 4h-9M14 20H5M14.7 4.7 9.3 19.3',
  underline:   'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3 M4 21h16',
  strike:      'M16 4H9a3 3 0 0 0-2.83 4 M14 12a4 4 0 0 1 0 8H6 M4 12h16',
  code:        'M10 9l-3 3 3 3 M14 9l3 3-3 3',
  sub:         'M4 5l8 8 M12 5 4 13 M20 21h-4l3.5-4a1.73 1.73 0 0 0-3.3-1',
  sup:         'M4 19l8-8 M12 19 4 11 M20 12h-4l3.5-4a1.73 1.73 0 0 0-3.3-1',
  alignLeft:   'M3 6h18 M3 12h12 M3 18h9',
  alignCenter: 'M3 6h18 M6 12h12 M9 18h6',
  alignRight:  'M3 6h18 M9 12h12 M15 18h6',
  alignJust:   'M3 6h18 M3 12h18 M3 18h18',
  bulletList:  'M9 6h11 M9 12h11 M9 18h11 M5 6v.01 M5 12v.01 M5 18v.01',
  orderedList: 'M10 6h11 M10 12h11 M10 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  indent:      'M3 8l4 4-4 4 M11 6h10 M11 12h10 M11 18h10',
  outdent:     'M7 8l-4 4 4 4 M11 6h10 M11 12h10 M11 18h10',
  blockquote:  'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  codeBlock:   'M8 3H5a2 2 0 0 0-2 2v3 M21 8V5a2 2 0 0 0-2-2h-3 M3 16v3a2 2 0 0 0 2 2h3 M16 21h3a2 2 0 0 0 2-2v-3 M10 9l-2 2 2 2 M14 15l2-2-2-2',
  hr:          'M3 12h18',
  link:        'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  unlink:      'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71 M3 3l18 18',
  image:       'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  table:       'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  addCol:      'M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6 M16 3v18 M21 12h-5 M18.5 9.5v5',
  addRow:      'M3 11V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6 M3 16h18 M12 21v-5 M9.5 18.5h5',
  delCol:      'M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6 M16 3v18 M19 9l-4 4m0-4l4 4',
  delRow:      'M3 11V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6 M3 16h18 M10 21l4-4m0 4l-4-4',
  delTable:    'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  clearFmt:    'M4 7V4h16v3 M9 20h6 M12 4v16 M5 20l14-16',
  textColor:   'M9 3l-6 18 M15 3l6 18 M4.5 12h15',
  highlight:   'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7',
}

/* ── Tooltip wrapper ─────────────────────────────── */
function Tip({ label, shortcut, children }: { label: string; shortcut?: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover/tip:flex flex-col items-center">
        <div className="bg-gray-900 text-white text-[11px] rounded px-2 py-1 whitespace-nowrap shadow-lg">
          {label}{shortcut && <span className="ml-1.5 opacity-60">{shortcut}</span>}
        </div>
        <div className="border-4 border-transparent border-t-gray-900 -mt-px" />
      </div>
    </div>
  )
}

/* ── Ribbon button ───────────────────────────────── */
function Btn({
  onClick, active, disabled, label, shortcut, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  shortcut?: string
  children: React.ReactNode
}) {
  return (
    <Tip label={label} shortcut={shortcut}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
          active
            ? 'bg-teal-700 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        } disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {children}
      </button>
    </Tip>
  )
}

/* ── Group divider ───────────────────────────────── */
function Sep() {
  return <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />
}

/* ── Group label ─────────────────────────────────── */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-0.5 pb-0.5">{children}</div>
      <span className="text-[9px] text-gray-400 leading-none tracking-wide uppercase">{label}</span>
    </div>
  )
}

/* ── Tooltip select ──────────────────────────────── */
function TipSelect({
  value, onChange, options, label, className,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  label: string
  className?: string
}) {
  return (
    <Tip label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-8 text-xs border border-gray-200 rounded px-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-gray-400 transition-colors ${className ?? ''}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Tip>
  )
}

/* ══════════════════════════════════════════════════ */
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-teal-700 underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded my-2' } }),
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate({ editor }) { onChange(editor.getHTML()) },
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[360px] px-5 py-4' },
      handlePaste(view, event) {
        const items = event.clipboardData?.items
        if (!items) return false
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (!file) continue
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              if (src) {
                const node = view.state.schema.nodes.image.create({ src })
                view.dispatch(view.state.tr.replaceSelectionWith(node))
              }
            }
            reader.readAsDataURL(file)
            return true
          }
        }
        return false
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        for (const file of Array.from(files)) {
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              if (src) {
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? 0
                view.dispatch(view.state.tr.insert(pos, view.state.schema.nodes.image.create({ src })))
              }
            }
            reader.readAsDataURL(file)
            return true
          }
        }
        return false
      },
    },
  })

  const applyLink = useCallback(() => {
    if (!editor) return
    if (linkUrl) editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const uploadImage = useCallback((file: File) => {
    if (!editor) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (src) editor.chain().focus().setImage({ src }).run()
    }
    reader.readAsDataURL(file)
  }, [editor])

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  const currentHeading = editor.isActive('heading', { level: 1 }) ? 'h1'
    : editor.isActive('heading', { level: 2 }) ? 'h2'
    : editor.isActive('heading', { level: 3 }) ? 'h3'
    : editor.isActive('heading', { level: 4 }) ? 'h4'
    : 'p'

  const inTable = editor.isActive('table')

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">

      {/* ══ RIBBON ══════════════════════════════════ */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-end gap-1.5 px-3 py-2">

          {/* History */}
          <Group label="History">
            <Btn label="Undo" shortcut="Ctrl+Z" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
              <Icon d={ICONS.undo} />
            </Btn>
            <Btn label="Redo" shortcut="Ctrl+Y" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
              <Icon d={ICONS.redo} />
            </Btn>
          </Group>

          <Sep />

          {/* Style dropdowns */}
          <Group label="Style">
            <TipSelect
              label="Paragraph Style"
              value={currentHeading}
              className="w-28"
              onChange={(v) => {
                if (v === 'p') editor.chain().focus().setParagraph().run()
                else editor.chain().focus().setHeading({ level: Number(v.replace('h', '')) as 1|2|3|4 }).run()
              }}
              options={[
                { label: 'Paragraph', value: 'p' },
                { label: 'Heading 1', value: 'h1' },
                { label: 'Heading 2', value: 'h2' },
                { label: 'Heading 3', value: 'h3' },
                { label: 'Heading 4', value: 'h4' },
              ]}
            />
            <TipSelect
              label="Font Family"
              value={editor.getAttributes('textStyle').fontFamily ?? ''}
              className="w-32"
              onChange={(v) => {
                if (v) editor.chain().focus().setFontFamily(v).run()
                else editor.chain().focus().unsetFontFamily().run()
              }}
              options={[
                { label: 'Default Font', value: '' },
                { label: 'Arial', value: 'Arial' },
                { label: 'Georgia', value: 'Georgia' },
                { label: 'Times New Roman', value: 'Times New Roman' },
                { label: 'Courier New', value: 'Courier New' },
                { label: 'Verdana', value: 'Verdana' },
                { label: 'Trebuchet MS', value: 'Trebuchet MS' },
              ]}
            />
          </Group>

          <Sep />

          {/* Text formatting */}
          <Group label="Format">
            <Btn label="Bold" shortcut="Ctrl+B" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
              <Icon d={ICONS.bold} />
            </Btn>
            <Btn label="Italic" shortcut="Ctrl+I" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <Icon d={ICONS.italic} />
            </Btn>
            <Btn label="Underline" shortcut="Ctrl+U" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <Icon d={ICONS.underline} />
            </Btn>
            <Btn label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <Icon d={ICONS.strike} />
            </Btn>
            <Btn label="Inline Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
              <Icon d={ICONS.code} />
            </Btn>
            <Btn label="Subscript (X₂)" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}>
              <Icon d={ICONS.sub} />
            </Btn>
            <Btn label="Superscript (X²)" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
              <Icon d={ICONS.sup} />
            </Btn>
          </Group>

          <Sep />

          {/* Color */}
          <Group label="Color">
            <Tip label="Text Color">
              <label className="flex flex-col items-center justify-center w-8 h-8 rounded cursor-pointer hover:bg-gray-200 transition-colors relative">
                <Icon d={ICONS.textColor} size={13} />
                <div className="w-4 h-1 rounded-sm mt-0.5" style={{ backgroundColor: editor.getAttributes('textStyle').color ?? '#000000' }} />
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={editor.getAttributes('textStyle').color ?? '#000000'}
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
              </label>
            </Tip>
            <Tip label="Highlight Color">
              <label className="flex flex-col items-center justify-center w-8 h-8 rounded cursor-pointer hover:bg-gray-200 transition-colors relative">
                <Icon d={ICONS.highlight} size={13} />
                <div className="w-4 h-1 rounded-sm mt-0.5 bg-yellow-300" />
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  defaultValue="#fde047"
                  onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                />
              </label>
            </Tip>
          </Group>

          <Sep />

          {/* Alignment */}
          <Group label="Align">
            <Btn label="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
              <Icon d={ICONS.alignLeft} />
            </Btn>
            <Btn label="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
              <Icon d={ICONS.alignCenter} />
            </Btn>
            <Btn label="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
              <Icon d={ICONS.alignRight} />
            </Btn>
            <Btn label="Justify Text" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
              <Icon d={ICONS.alignJust} />
            </Btn>
          </Group>

          <Sep />

          {/* Lists */}
          <Group label="Lists">
            <Btn label="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <Icon d={ICONS.bulletList} />
            </Btn>
            <Btn label="Numbered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <Icon d={ICONS.orderedList} />
            </Btn>
            <Btn label="Increase Indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')}>
              <Icon d={ICONS.indent} />
            </Btn>
            <Btn label="Decrease Indent" onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')}>
              <Icon d={ICONS.outdent} />
            </Btn>
          </Group>

          <Sep />

          {/* Blocks */}
          <Group label="Blocks">
            <Btn label="Block Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Icon d={ICONS.blockquote} />
            </Btn>
            <Btn label="Code Block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <Icon d={ICONS.codeBlock} />
            </Btn>
            <Btn label="Horizontal Divider Line" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <Icon d={ICONS.hr} />
            </Btn>
          </Group>

          <Sep />

          {/* Insert */}
          <Group label="Insert">
            <Btn label={editor.isActive('link') ? 'Edit Link' : 'Insert Hyperlink'} shortcut="Ctrl+K" active={editor.isActive('link')} onClick={() => setShowLinkInput((v) => !v)}>
              <Icon d={ICONS.link} />
            </Btn>
            {editor.isActive('link') && (
              <Btn label="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()}>
                <Icon d={ICONS.unlink} />
              </Btn>
            )}
            <Btn label="Upload Image from Device" onClick={() => fileInputRef.current?.click()}>
              <Icon d={ICONS.image} />
            </Btn>
            <Btn label="Insert Table (3 × 3)" onClick={insertTable}>
              <Icon d={ICONS.table} />
            </Btn>
          </Group>

          {/* Table controls — only shown when cursor is inside a table */}
          {inTable && (
            <>
              <Sep />
              <Group label="Table">
                <Btn label="Add Column to the Right" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Icon d={ICONS.addCol} />
                </Btn>
                <Btn label="Add Row Below" onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Icon d={ICONS.addRow} />
                </Btn>
                <Btn label="Delete Current Column" onClick={() => editor.chain().focus().deleteColumn().run()}>
                  <Icon d={ICONS.delCol} />
                </Btn>
                <Btn label="Delete Current Row" onClick={() => editor.chain().focus().deleteRow().run()}>
                  <Icon d={ICONS.delRow} />
                </Btn>
                <Btn label="Delete Entire Table" onClick={() => editor.chain().focus().deleteTable().run()}>
                  <Icon d={ICONS.delTable} />
                </Btn>
              </Group>
            </>
          )}

          <Sep />

          {/* Clear */}
          <Group label="Clear">
            <Btn label="Clear All Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
              <Icon d={ICONS.clearFmt} />
            </Btn>
          </Group>
        </div>

        {/* Link URL bar */}
        {showLinkInput && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-t border-blue-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.link} />
            </svg>
            <span className="text-xs text-gray-600 font-medium">URL:</span>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
              placeholder="https://example.com"
              className="flex-1 text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button type="button" onClick={applyLink} className="px-3 py-1.5 text-xs font-bold bg-teal-700 text-white rounded hover:opacity-90">
              Apply
            </button>
            <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs text-gray-400 hover:text-gray-600 px-1">
              Cancel
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadImage(file)
            e.target.value = ''
          }}
        />
      </div>

      {/* ══ EDITOR AREA ═════════════════════════════ */}
      <div className="bg-white relative min-h-[360px]">
        {!editor.getText() && (
          <p className="absolute top-4 left-5 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder ?? 'Start writing your post here… paste or upload images, add links, format text.'}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* ══ STATUS BAR ══════════════════════════════ */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400">
        <span>{editor.getText().trim().split(/\s+/).filter(Boolean).length} words</span>
        <span className="text-gray-300">|</span>
        <span>{editor.getText().length} characters</span>
        <span className="text-gray-300">|</span>
        <span>Tip: paste or drag images directly into the editor</span>
      </div>

      {/* ══ PROSE STYLES ════════════════════════════ */}
      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror h1 { font-size: 2em; font-weight: 800; margin: .5em 0 .3em; line-height: 1.2; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: .5em 0 .3em; line-height: 1.3; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 700; margin: .5em 0 .3em; }
        .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin: .5em 0 .3em; }
        .ProseMirror p { margin: .4em 0; line-height: 1.7; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5em; margin: .4em 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5em; margin: .4em 0; }
        .ProseMirror li { margin: .2em 0; }
        .ProseMirror blockquote { border-left: 4px solid var(--primary); padding-left: 1em; color: #555; margin: .8em 0; font-style: italic; }
        .ProseMirror code { background: #f3f4f6; padding: .1em .35em; border-radius: 4px; font-size: .88em; font-family: monospace; color: #dc2626; }
        .ProseMirror pre { background: #1e293b; color: #e2e8f0; padding: 1em 1.2em; border-radius: 8px; overflow-x: auto; margin: .8em 0; }
        .ProseMirror pre code { background: none; color: inherit; padding: 0; font-size: .9em; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.2em 0; }
        .ProseMirror table { border-collapse: collapse; width: 100%; margin: .8em 0; }
        .ProseMirror td, .ProseMirror th { border: 1px solid #d1d5db; padding: .45em .65em; min-width: 60px; vertical-align: top; }
        .ProseMirror th { background: var(--bg-alt); font-weight: 700; }
        .ProseMirror img { max-width: 100%; border-radius: 6px; margin: .6em 0; display: block; }
        .ProseMirror a { color: #1d4ed8; text-decoration: underline; }
        .ProseMirror .selectedCell { outline: 2px solid #3b82f6; }
      `}</style>
    </div>
  )
}
