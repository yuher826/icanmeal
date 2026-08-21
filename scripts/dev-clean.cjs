/**
 * npm run dev:clean
 *
 * Windows 로컬 개발에서 .next 캐시가 꼬였을 때 한 번에 정리하고 dev 서버를 새로 띄운다.
 *   1) 이 프로젝트의 좀비 next 프로세스 정리 (포트 점유 + 커맨드라인 매칭)
 *   2) 산출물 폴더 삭제 (.next-dev, .next)
 *   3) next dev 기동
 *
 * PowerShell / cmd / Git Bash 어디서 실행해도 동작한다.
 * (package.json 에 PowerShell 전용 문법을 넣으면 Git Bash 에서 깨지므로 node 스크립트로 둔다)
 *
 * ⚠️ 다른 프로젝트의 node 프로세스는 건드리지 않는다.
 *    커맨드라인에 이 프로젝트 경로가 들어있는 것만 종료한다.
 */
const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const PORT = Number(process.env.PORT) || 3000
const PROJECT_DIR = process.cwd()
const ARTIFACT_DIRS = ['.next-dev', '.next']
const isWindows = os.platform() === 'win32'

function log(msg) {
  console.log(msg)
}

/** 포트를 LISTENING 중인 PID 목록 */
function pidsOnPort(port) {
  const pids = new Set()
  try {
    const out = isWindows
      ? execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' })
      : execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8' })

    if (isWindows) {
      for (const line of out.split('\n')) {
        const m = line.trim().match(/LISTENING\s+(\d+)\s*$/)
        if (m) pids.add(m[1])
      }
    } else {
      out.split('\n').map((s) => s.trim()).filter(Boolean).forEach((p) => pids.add(p))
    }
  } catch {
    // 매치 없음 = 포트 비어있음 (findstr/lsof 는 미매치 시 비정상 종료코드를 낸다)
  }
  return pids
}

/**
 * 이 프로젝트 경로를 커맨드라인에 가진 node 프로세스 PID.
 * 다른 프로젝트나 무관한 node 를 죽이지 않기 위한 안전장치.
 */
function pidsForThisProject() {
  const pids = new Set()
  if (!isWindows) return pids

  try {
    // CSV 로 뽑아 파싱 (경로에 공백/한글이 있어도 안전)
    const out = execSync(
      'powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"',
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
    )
    if (!out.trim()) return pids

    let rows = JSON.parse(out)
    if (!Array.isArray(rows)) rows = [rows]

    const needle = PROJECT_DIR.toLowerCase()
    for (const r of rows) {
      const cmd = (r.CommandLine || '').toLowerCase()
      if (!cmd) continue
      // 이 프로젝트 경로 + next 관련 프로세스만
      if (cmd.includes(needle) && (cmd.includes('next') || cmd.includes('dev-clean'))) {
        // 자기 자신은 제외
        if (String(r.ProcessId) !== String(process.pid)) pids.add(String(r.ProcessId))
      }
    }
  } catch {
    // 조회 실패해도 치명적이지 않다 — 포트 기준 정리로 폴백
  }
  return pids
}

function killPids(pids, label) {
  if (pids.size === 0) return 0
  let killed = 0
  for (const pid of pids) {
    try {
      execSync(isWindows ? `taskkill /F /T /PID ${pid}` : `kill -9 ${pid}`, { stdio: 'ignore' })
      killed++
    } catch {
      // 이미 종료됐을 수 있다 — 무시
    }
  }
  if (killed > 0) log(`  ✓ ${label} ${killed}개 종료`)
  return killed
}

function removeDir(name) {
  const target = path.join(PROJECT_DIR, name)
  if (!fs.existsSync(target)) {
    log(`  · ${name} 없음 (이미 깨끗)`)
    return
  }
  try {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
    log(`  ✓ ${name} 삭제`)
  } catch (e) {
    log(`  ⚠️ ${name} 삭제 실패: ${e.code || e.message}`)
    log('     → 아직 파일을 잡고 있는 프로세스가 있습니다.')
    log('       편집기/터미널을 닫고 다시 시도하거나, 백신 예외 등록을 확인하세요.')
    log('       (CLAUDE.md「로컬 개발 트러블슈팅」참고)')
    process.exit(1)
  }
}

log('── dev 서버 정리 후 재시작 ──')

log('[1/3] 좀비 프로세스 정리')
const portPids = pidsOnPort(PORT)
const projPids = pidsForThisProject()
// 포트 점유 PID 중 이 프로젝트 것이 아닐 수도 있으므로 합집합으로 처리하되,
// 포트 기준은 dev 서버가 확실하므로 함께 정리한다.
const all = new Set([...portPids, ...projPids])
if (all.size === 0) log(`  · 정리할 프로세스 없음 (포트 ${PORT} 비어있음)`)
else killPids(all, '프로세스')

log('[2/3] 산출물 삭제')
ARTIFACT_DIRS.forEach(removeDir)

log('[3/3] next dev 기동')
const child = spawn('npx next dev', { stdio: 'inherit', shell: true })
child.on('exit', (code) => process.exit(code ?? 0))
