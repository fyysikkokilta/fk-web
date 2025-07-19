import { useRef, useState } from 'react'

import { Link } from '@/i18n/navigation'
import type { Page } from '@/payload-types'

import type { DesktopMenuItemProps } from './types'
import { getChildrenArray, getMenuItemClasses, useNavigationUtils } from './utils'

export function DesktopMenuItem({
  item,
  level = 'main',
  index = 0,
  isOpen,
  onOpen,
  onClose,
  onNavigate,
  parentRef,
  grandparentRef
}: DesktopMenuItemProps) {
  const { isActive, getPath } = useNavigationUtils()
  const menuItemRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const submenuRef = useRef<HTMLUListElement>(null)

  // For sub-level items, manage their own submenu state
  const [childSubmenus, setChildSubmenus] = useState<Set<string>>(new Set())

  const itemPath = getPath(item)
  const hasChildren = item.type === 'menu' && level !== 'subsub'

  // Create proper hierarchical ID
  const id = level === 'main' ? item.id || index.toString() : `${index}`

  // Get children with proper type checking
  const children = getChildrenArray(item, level, hasChildren)

  const className = getMenuItemClasses(isActive((item.page as Page)?.path), hasChildren, level)

  // Handle child submenu state
  const openChildSubmenu = (childId: string) => {
    setChildSubmenus((prev) => new Set(prev).add(childId))
  }

  const closeChildSubmenu = (childId: string) => {
    setChildSubmenus((prev) => {
      const newSet = new Set(prev)
      newSet.delete(childId)
      return newSet
    })
  }

  const closeAllChildSubmenus = () => {
    setChildSubmenus(new Set())
  }

  // Handle blur events to close submenu when focus leaves
  const handleBlur = () => {
    // Use setTimeout to allow the new focus target to be determined
    setTimeout(() => {
      const currentElement = menuItemRef.current
      const submenuElement = submenuRef.current
      const newFocusTarget = document.activeElement

      if (!currentElement || !newFocusTarget || !hasChildren || !isOpen) return

      // Check if focus is staying within this menu item or its submenu
      const focusStayingOnMenuItem = currentElement === newFocusTarget
      const focusStayingInSubmenu = submenuElement?.contains(newFocusTarget as Node)

      // Only close if focus is completely leaving this menu item and its submenu
      if (!focusStayingOnMenuItem && !focusStayingInSubmenu) {
        onClose()
        closeAllChildSubmenus()
      }
    }, 0)
  }

  // Get all menu items in current container
  const getMenuItems = () => {
    const currentElement = menuItemRef.current
    if (!currentElement) return []

    const menuContainer = currentElement.closest('[role="menubar"], [role="menu"]')
    return Array.from(
      menuContainer?.querySelectorAll(':scope > li > [role="menuitem"]') || []
    ) as HTMLElement[]
  }

  // Navigate to adjacent menu item
  const navigateToAdjacentItem = (direction: 'next' | 'prev') => {
    const menuItems = getMenuItems()
    const currentIndex = menuItems.indexOf(menuItemRef.current!)

    if (currentIndex === -1) return

    if (direction === 'next' && currentIndex < menuItems.length - 1) {
      menuItems[currentIndex + 1].focus()
    } else if (direction === 'prev' && currentIndex > 0) {
      menuItems[currentIndex - 1].focus()
    }
  }

  // Move focus to first submenu item
  const focusFirstSubmenuItem = () => {
    setTimeout(() => {
      const firstItem = submenuRef.current?.querySelector(
        ':scope > li > [role="menuitem"]'
      ) as HTMLElement
      firstItem?.focus()
    }, 0)
  }

  // Return focus to parent menu item
  const returnToParent = () => {
    if (parentRef?.current) {
      onClose()
      closeAllChildSubmenus()
      parentRef.current.focus()
    }
  }

  // Return focus to top-level (grandparent for sub items, self for main items)
  const returnToTopLevel = () => {
    const topLevelRef = grandparentRef || parentRef || menuItemRef
    if (topLevelRef?.current) {
      onClose()
      closeAllChildSubmenus()
      topLevelRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (hasChildren) {
          // Toggle submenu for buttons
          if (isOpen) {
            onClose()
            closeAllChildSubmenus()
          } else {
            onOpen()
          }
          // Keep focus on button
          menuItemRef.current?.focus()
        } else {
          // Activate link and close all menus
          onNavigate()
          menuItemRef.current?.click()
        }
        break
      case ' ':
        e.preventDefault()
        if (hasChildren) {
          // Toggle submenu for buttons on space
          if (isOpen) {
            onClose()
            closeAllChildSubmenus()
          } else {
            onOpen()
          }
          // Keep focus on button
          menuItemRef.current?.focus()
        }
        // Do nothing for links on space (to allow page scrolling)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (hasChildren && isOpen) {
          // Move into submenu
          focusFirstSubmenuItem()
        } else if (level !== 'main') {
          // Navigate to next item in submenu
          navigateToAdjacentItem('next')
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (level === 'main') {
          if (hasChildren && !isOpen) {
            // Open submenu and move focus to first item
            onOpen()
            focusFirstSubmenuItem()
          } else {
            // Navigate to next top-level item
            navigateToAdjacentItem('next')
          }
        } else if (hasChildren && !isOpen) {
          // Open submenu at sub level
          onOpen()
          focusFirstSubmenuItem()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (level !== 'main') {
          // Navigate to previous item in submenu or return to parent
          const menuItems = getMenuItems()
          const currentIndex = menuItems.indexOf(menuItemRef.current!)

          if (currentIndex > 0) {
            menuItems[currentIndex - 1].focus()
          } else {
            // Return to parent menu item
            returnToParent()
          }
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (level === 'main') {
          // Navigate to previous top-level item
          navigateToAdjacentItem('prev')
        } else {
          // Return to parent menu item
          returnToParent()
        }
        break
      case 'Escape':
        e.preventDefault()
        // Return focus to top-level parent
        returnToTopLevel()
        break
    }
  }

  return (
    <li
      className="relative"
      role="none"
      onMouseEnter={() => {
        if (hasChildren) {
          onOpen()
        }
      }}
      onMouseLeave={() => {
        if (hasChildren) {
          onClose()
          closeAllChildSubmenus()
        }
      }}
    >
      {hasChildren ? (
        <button
          ref={menuItemRef as React.RefObject<HTMLButtonElement>}
          id={`${level}-menuitem-${id}`}
          className={className}
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={isOpen || false}
          aria-controls={`${level}-submenu-${id}`}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={() => {
            // For click, we want to toggle
            if (isOpen) {
              onClose()
              closeAllChildSubmenus()
            } else {
              onOpen()
            }
          }}
        >
          {item.label}
        </button>
      ) : (
        <Link
          ref={menuItemRef as React.RefObject<HTMLAnchorElement>}
          href={itemPath}
          id={`${level}-menuitem-${id}`}
          className={className}
          role="menuitem"
          aria-current={isActive((item.page as Page)?.path) ? 'page' : undefined}
          onKeyDown={handleKeyDown}
          onClick={() => onNavigate()}
        >
          {item.label}
        </Link>
      )}
      {hasChildren && isOpen && children.length > 0 && (
        <ul
          ref={submenuRef}
          id={`${level}-submenu-${id}`}
          className={`bg-fk-gray absolute w-fit shadow-lg ${
            level === 'main' ? 'top-full left-0' : 'top-0 left-full'
          }`}
          role="menu"
          aria-labelledby={`${level}-menuitem-${id}`}
        >
          {children.map((child, childIndex) => {
            const childId = `${id}-${childIndex}`
            return (
              <DesktopMenuItem
                key={child.id || childIndex}
                item={child}
                level={level === 'main' ? 'sub' : 'subsub'}
                index={childIndex}
                isOpen={childSubmenus.has(childId)}
                onOpen={() => openChildSubmenu(childId)}
                onClose={() => closeChildSubmenu(childId)}
                onNavigate={onNavigate}
                parentRef={menuItemRef as React.RefObject<HTMLButtonElement>}
                grandparentRef={parentRef}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}
