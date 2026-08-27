<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dbFile = __DIR__ . '/db_data.json';

function getDb($dbFile) {
    if (file_exists($dbFile)) {
        $content = file_get_contents($dbFile);
        $data = json_decode($content, true);
        if ($data) return $data;
    }
    return [
        'banners' => [
            ['id' => '1', 'name' => 'LLWIN', 'imageUrl' => './uploads/banner_1773924084584_dded26c768daf8.png', 'link' => 'https://www.07llwin.com/?id=832516623', 'locked' => false, 'sortOrder' => 1]
        ],
        'codes' => [
            ['id' => 'code-1', 'code' => 'LLWIN-SAFE-888', 'status' => 'SAFE', 'targetUser' => '', 'isUsed' => false, 'usedAt' => null, 'usedBy' => null, 'createdAt' => date('c'), 'note' => 'Mã an toàn VIP'],
            ['id' => 'code-2', 'code' => 'LLWIN-WARN-999', 'status' => 'INFECTED', 'targetUser' => '', 'isUsed' => false, 'usedAt' => null, 'usedBy' => null, 'createdAt' => date('c'), 'note' => 'Mã dính mã ẩn test']
        ],
        'config' => [
            'defaultHouseLink' => 'https://www.07llwin.com/?id=832516623',
            'supportTelegram' => 'https://t.me/thosantp79',
            'siteTitle' => '[ TOOL XOÁ MÃ ẨN ]'
        ],
        'adminCreds' => ['username' => 'admin', 'password' => 'admin123'],
        'updatedAt' => date('c')
    ];
}

function saveDb($dbFile, $data) {
    $data['updatedAt'] = date('c');
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? '';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? [];
$db = getDb($dbFile);

if ($action === 'data' || ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($action))) {
    echo json_encode([
        'success' => true,
        'banners' => $db['banners'] ?? [],
        'codes' => $db['codes'] ?? [],
        'config' => $db['config'] ?? [],
        'adminCreds' => $db['adminCreds'] ?? [],
        'updatedAt' => $db['updatedAt'] ?? date('c')
    ]);
    exit;
}

if ($action === 'consume' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = strtoupper(trim($input['code'] ?? ''));
    $username = trim($input['username'] ?? '');

    if (empty($code)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Vui lòng nhập mã code xác thực!']);
        exit;
    }

    $foundIndex = -1;
    if (isset($db['codes']) && is_array($db['codes'])) {
        foreach ($db['codes'] as $idx => $c) {
            if (isset($c['code']) && $c['code'] === $code) {
                $foundIndex = $idx;
                break;
            }
        }
    }

    if ($foundIndex === -1) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Mã code không hợp lệ hoặc không tồn tại trên hệ thống!']);
        exit;
    }

    $codeObj = $db['codes'][$foundIndex];
    if (!empty($codeObj['isUsed'])) {
        $usedTime = !empty($codeObj['usedAt']) ? date('H:i:s d/m/Y', strtotime($codeObj['usedAt'])) : 'trước đó';
        $userText = !empty($codeObj['usedBy']) ? ' bởi tài khoản "' . $codeObj['usedBy'] . '"' : '';
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Mã này đã được sử dụng' . $userText . ' vào lúc ' . $usedTime . '. Mỗi mã chỉ được dùng 1 lần!']);
        exit;
    }

    if (!empty($codeObj['targetUser']) && !empty($username) && strtolower($codeObj['targetUser']) !== strtolower($username)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Mã này được cấp riêng cho tài khoản "' . $codeObj['targetUser'] . '". Tài khoản "' . $username . '" không có quyền sử dụng!']);
        exit;
    }

    $db['codes'][$foundIndex]['isUsed'] = true;
    $db['codes'][$foundIndex]['usedAt'] = date('c');
    $db['codes'][$foundIndex]['usedBy'] = !empty($username) ? $username : 'Khách';
    saveDb($dbFile, $db);

    echo json_encode([
        'success' => true,
        'status' => $codeObj['status'],
        'code' => $codeObj['code'],
        'usedBy' => $db['codes'][$foundIndex]['usedBy']
    ]);
    exit;
}

if ($action === 'sync' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($input['codes']) && is_array($input['codes'])) {
        $db['codes'] = $input['codes'];
    }
    if (isset($input['banners']) && is_array($input['banners'])) {
        $db['banners'] = $input['banners'];
    }
    if (isset($input['config']) && is_array($input['config'])) {
        $db['config'] = array_merge($db['config'] ?? [], $input['config']);
    }
    if (isset($input['adminCreds']) && is_array($input['adminCreds'])) {
        $db['adminCreds'] = array_merge($db['adminCreds'] ?? [], $input['adminCreds']);
    }
    saveDb($dbFile, $db);
    echo json_encode(['success' => true, 'db' => $db]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
