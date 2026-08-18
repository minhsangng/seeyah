import { useRef, useEffect } from 'react'

export default function SkyEffect({
  starCount = 120,
  shootingStarChance = 0.01,
  moonX = 0.5,
  moonY = 0.18,
  moonRadius = 45,
  showMoonGlow = true,
  showNebula = true,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let stars = []
    let shootingStars = []
    let nebulaClouds = []
    let isActive = true
    let time = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: starCount }, () => createStar(canvas.offsetWidth, canvas.offsetHeight))
      nebulaClouds = createNebulaClouds(canvas.offsetWidth, canvas.offsetHeight)
    }

    function createStar(w, h) {
      const isBright = Math.random() < 0.2
      const colorRoll = Math.random()
      let color = '255, 255, 255'
      if (colorRoll < 0.08) color = '255, 235, 200'
      else if (colorRoll < 0.15) color = '200, 220, 255'

      return {
        x: Math.random() * w,
        y: Math.random() * (h / 2),
        radius: isBright ? Math.random() * 1 + 1.5 : Math.random() * 0.5 + 0.8,
        maxAlpha: isBright ? 1 : Math.random() * 0.4 + 0.6,
        age: 0,
        duration: Math.random() * 150 + 90,
        spikeLength: isBright ? Math.random() * 6 + 10 : Math.random() * 3 + 4,
        rotation: Math.random() * Math.PI * 0.5,
        color,
      }
    }

    function createNebulaClouds(w, h) {
      const palette = [
        '150, 130, 220',
        '110, 150, 220',
        '180, 140, 200',
      ]
      return Array.from({ length: 4 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        radius: Math.random() * 150 + 180,
        color: palette[Math.floor(Math.random() * palette.length)],
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.1 + 0.25,
        pulseSpeed: Math.random() * 0.0015 + 0.0005,
        pulsePhase: Math.random() * Math.PI * 2,
      }))
    }

    function createShootingStar() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const startX = Math.random() * w
      const startY = Math.random() * h * 0.5
      const angle = (Math.random() * 30 + 30) * (Math.PI / 180)
      const speed = Math.random() * 6 + 8

      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        length: Math.random() * 80 + 60,
      })
    }

    function drawNebula(w, h) {
      nebulaClouds.forEach(cloud => {
        cloud.x += cloud.speedX
        cloud.y += cloud.speedY
        cloud.pulsePhase += cloud.pulseSpeed

        if (cloud.x < -cloud.radius) cloud.x = w + cloud.radius
        if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius
        if (cloud.y < -cloud.radius) cloud.y = h + cloud.radius
        if (cloud.y > h + cloud.radius) cloud.y = -cloud.radius

        const pulse = 0.7 + 0.3 * Math.sin(cloud.pulsePhase)
        const alpha = cloud.alpha * pulse

        const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius)
        gradient.addColorStop(0, `rgba(${cloud.color}, ${alpha})`)
        gradient.addColorStop(1, `rgba(${cloud.color}, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawMoonGlow(w, h) {
      const cx = w * moonX
      const cy = h * moonY
      const pulse = 0.85 + 0.15 * Math.sin(time * 0.0006)
      const outerRadius = moonRadius * 3.2 * pulse

      const gradient = ctx.createRadialGradient(cx, cy, moonRadius * 0.6, cx, cy, outerRadius)
      gradient.addColorStop(0, 'rgba(255, 250, 230, 0.35)')
      gradient.addColorStop(0.4, 'rgba(255, 250, 230, 0.12)')
      gradient.addColorStop(1, 'rgba(255, 250, 230, 0)')

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawSparkleStar(x, y, radius, alpha, spikeLength, rotation, color) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      const glowRadius = radius * 4
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius)
      glow.addColorStop(0, `rgba(${color}, ${alpha * 0.6})`)
      glow.addColorStop(1, `rgba(${color}, 0)`)
      ctx.beginPath()
      ctx.fillStyle = glow
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      const vGrad = ctx.createLinearGradient(0, -spikeLength, 0, spikeLength)
      vGrad.addColorStop(0, `rgba(${color}, 0)`)
      vGrad.addColorStop(0.5, `rgba(${color}, ${alpha})`)
      vGrad.addColorStop(1, `rgba(${color}, 0)`)
      ctx.strokeStyle = vGrad
      ctx.lineWidth = Math.max(radius * 0.5, 0.6)
      ctx.beginPath()
      ctx.moveTo(0, -spikeLength)
      ctx.lineTo(0, spikeLength)
      ctx.stroke()

      const hGrad = ctx.createLinearGradient(-spikeLength, 0, spikeLength, 0)
      hGrad.addColorStop(0, `rgba(${color}, 0)`)
      hGrad.addColorStop(0.5, `rgba(${color}, ${alpha})`)
      hGrad.addColorStop(1, `rgba(${color}, 0)`)
      ctx.strokeStyle = hGrad
      ctx.beginPath()
      ctx.moveTo(-spikeLength, 0)
      ctx.lineTo(spikeLength, 0)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = `rgba(${color}, ${alpha})`
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    function draw() {
      if (!isActive) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      time++
      ctx.clearRect(0, 0, w, h)

      if (showNebula) drawNebula(w, h)
      if (showMoonGlow) drawMoonGlow(w, h)

      stars.forEach((star, index) => {
        star.age++
        const progress = star.age / star.duration

        if (progress >= 1) {
          stars[index] = createStar(w, h)
          return
        }

        const alpha = star.maxAlpha * Math.sin(progress * Math.PI)
        const currentSpike = star.spikeLength * (0.5 + 0.5 * Math.sin(progress * Math.PI))
        drawSparkleStar(star.x, star.y, star.radius, alpha, currentSpike, star.rotation, star.color)
      })

      if (Math.random() < shootingStarChance) {
        createShootingStar()
      }

      shootingStars.forEach(s => {
        const tailX = s.x - s.vx * (s.length / 20)
        const tailY = s.y - s.vy * (s.length / 20)

        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        s.x += s.vx
        s.y += s.vy
        s.life -= 0.015
      })

      shootingStars = shootingStars.filter(s => s.life > 0)
      animationId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      isActive = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [starCount, shootingStarChance, moonX, moonY, moonRadius, showMoonGlow, showNebula])

  return (
    <canvas ref={canvasRef} className='absolute inset-0 w-full h-full pointer-events-none' />
  )
}