#!/bin/bash
# =============================================================================
# CenterPort Backend - CRUD Endpoint Test Script
# =============================================================================
# Prerequisites: Server running on localhost:8080 (mvn spring-boot:run)
# Usage: bash test-endpoints.sh
# =============================================================================

BASE_URL="http://localhost:8080"
PASS=0
FAIL=0
LOG_FILE="test-results-$(date +%Y%m%d-%H%M%S).log"

# --- Logging: tee all output to file ---
exec > >(tee -a "$LOG_FILE") 2>&1
echo "Test run started: $(date)"
echo "Results will be saved to: $LOG_FILE"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

header() {
    echo ""
    echo -e "${CYAN}======================================================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}======================================================================${NC}"
}

step() {
    echo ""
    echo -e "${YELLOW}>>> $1${NC}"
}

pass() {
    PASS=$((PASS + 1))
    echo -e "  ${GREEN}[PASS]${NC} $1"
}

fail() {
    FAIL=$((FAIL + 1))
    echo -e "  ${RED}[FAIL]${NC} $1"
}

info() {
    echo -e "  ${GRAY}$1${NC}"
}

# --- HTTP helpers using curl ---
# Usage: response=$(api_call METHOD URL [BODY])
# Sets global: HTTP_STATUS, HTTP_BODY
api_call() {
    local method="$1"
    local url="$2"
    local body="$3"

    if [ -n "$body" ]; then
        local response
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$body" \
            "$url")
    else
        local response
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            "$url")
    fi

    HTTP_STATUS=$(echo "$response" | tail -1)
    HTTP_BODY=$(echo "$response" | sed '$d')

    # Save response to log
    echo "" >> "$LOG_FILE.responses"
    echo "--- $method $url [HTTP $HTTP_STATUS] ---" >> "$LOG_FILE.responses"
    echo "$HTTP_BODY" >> "$LOG_FILE.responses"
}

check_status() {
    local method="$1"
    local url="$2"
    local expected="$3"

    if [ "$HTTP_STATUS" -eq "$expected" ]; then
        pass "$method $url -> $HTTP_STATUS"
    else
        fail "$method $url -> Expected $expected, got $HTTP_STATUS"
    fi
}

# Extract a JSON field value (simple jq alternative if jq is available)
json_field() {
    local field="$1"
    if command -v jq &> /dev/null; then
        echo "$HTTP_BODY" | jq -r "$field"
    else
        # Fallback: grep-based extraction (works for simple string values)
        echo "$HTTP_BODY" | grep -o "\"${field#.}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 | sed 's/.*: *"\(.*\)"/\1/'
    fi
}

# =============================================================================
# Test: Seafarer Profiles
# =============================================================================
header "SEAFARER PROFILES (/api/profiles)"

# CREATE
step "1. CREATE a new profile"
api_call POST "$BASE_URL/api/profiles" '{
    "last_name": "Dela Cruz",
    "first_name": "Juan",
    "middle_name": "Santos",
    "address": "123 Manila St.",
    "city": "Manila",
    "contact_no": "09171234567",
    "gender": "MALE",
    "nationality": "Filipino",
    "position": "Able Seaman",
    "employer": "Ocean Shipping Co."
}'
check_status POST "/api/profiles" 201

PROFILE_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Created ID: $PROFILE_ID"

# READ
step "2. READ the created profile"
api_call GET "$BASE_URL/api/profiles/$PROFILE_ID"
check_status GET "/api/profiles/$PROFILE_ID" 200

if echo "$HTTP_BODY" | grep -q '"last_name":"Dela Cruz"'; then
    pass "Data integrity verified (last_name = Dela Cruz)"
else
    fail "Data mismatch on read"
fi

# LIST
step "3. LIST all profiles (paginated)"
api_call GET "$BASE_URL/api/profiles?page=0&size=5"
check_status GET "/api/profiles?page=0&size=5" 200

TOTAL=$(echo "$HTTP_BODY" | grep -o '"total_elements":[0-9]*' | cut -d: -f2)
info "Total elements: $TOTAL"

# UPDATE
step "4. UPDATE the profile"
api_call PUT "$BASE_URL/api/profiles/$PROFILE_ID" '{
    "last_name": "Dela Cruz",
    "first_name": "Juan Carlos",
    "middle_name": "Santos",
    "address": "456 Quezon Ave.",
    "city": "Quezon City",
    "contact_no": "09181234567",
    "gender": "MALE",
    "nationality": "Filipino",
    "position": "Bosun",
    "employer": "Pacific Marine Inc."
}'
check_status PUT "/api/profiles/$PROFILE_ID" 200

if echo "$HTTP_BODY" | grep -q '"first_name":"Juan Carlos"'; then
    pass "Update verified (first_name = Juan Carlos)"
else
    fail "Update not reflected"
fi

# DELETE (not implemented - expect 405)
step "5. DELETE the profile (expect 405 - not implemented)"
api_call DELETE "$BASE_URL/api/profiles/$PROFILE_ID"
check_status DELETE "/api/profiles/$PROFILE_ID" 405

# =============================================================================
# Test: Medical Exams
# =============================================================================
header "MEDICAL EXAMS (/api/medical-exams)"

# CREATE
step "1. CREATE a new medical exam"
api_call POST "$BASE_URL/api/medical-exams" '{
    "last_name": "Santos",
    "first_name": "Maria",
    "middle_name": "Garcia",
    "gender": "Female",
    "civil_status": "Single",
    "address": "789 Rizal Blvd",
    "contact_no": "09191234567",
    "nationality": "Filipino",
    "employer": "Global Shipping Ltd.",
    "position": "Cook",
    "pe_height": "160",
    "pe_weight": "55",
    "pe_bp_systolic": "120",
    "pe_bp_diastolic": "80",
    "pe_pulse_rate": "72"
}'
check_status POST "/api/medical-exams" 201

EXAM_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Created ID: $EXAM_ID"

# READ
step "2. READ the created medical exam"
api_call GET "$BASE_URL/api/medical-exams/$EXAM_ID"
check_status GET "/api/medical-exams/$EXAM_ID" 200

if echo "$HTTP_BODY" | grep -q '"last_name":"Santos"'; then
    pass "Data integrity verified (last_name = Santos)"
else
    fail "Data mismatch on read"
fi

# LIST
step "3. LIST all medical exams (paginated)"
api_call GET "$BASE_URL/api/medical-exams?page=0&size=5"
check_status GET "/api/medical-exams?page=0&size=5" 200

TOTAL=$(echo "$HTTP_BODY" | grep -o '"total_elements":[0-9]*' | cut -d: -f2)
info "Total elements: $TOTAL"

# UPDATE
step "4. UPDATE the medical exam"
api_call PUT "$BASE_URL/api/medical-exams/$EXAM_ID" '{
    "last_name": "Santos",
    "first_name": "Maria",
    "middle_name": "Garcia",
    "gender": "Female",
    "civil_status": "Single",
    "address": "789 Rizal Blvd",
    "contact_no": "09191234567",
    "nationality": "Filipino",
    "employer": "Global Shipping Ltd.",
    "position": "Chief Cook",
    "pe_height": "160",
    "pe_weight": "56",
    "pe_bp_systolic": "118",
    "pe_bp_diastolic": "78",
    "pe_pulse_rate": "70",
    "remarks": "Follow-up in 6 months"
}'
check_status PUT "/api/medical-exams/$EXAM_ID" 200

if echo "$HTTP_BODY" | grep -q '"position":"Chief Cook"'; then
    pass "Update verified (position = Chief Cook)"
else
    fail "Update not reflected"
fi

# DELETE (not implemented)
step "5. DELETE the medical exam (expect 405 - not implemented)"
api_call DELETE "$BASE_URL/api/medical-exams/$EXAM_ID"
check_status DELETE "/api/medical-exams/$EXAM_ID" 405

# =============================================================================
# Test: Landbase PEMEs
# =============================================================================
header "LANDBASE PEMEs (/api/landbase-pemes)"

# CREATE
step "1. CREATE a new landbase PEME"
api_call POST "$BASE_URL/api/landbase-pemes" '{
    "last_name": "Reyes",
    "first_name": "Pedro",
    "middle_name": "Lopez",
    "gender": "Male",
    "civil_status": "Married",
    "address": "321 Bonifacio St.",
    "contact_no": "09201234567",
    "nationality": "Filipino",
    "employer": "Land Construction Corp.",
    "position": "Welder",
    "blood_type": "O+"
}'
check_status POST "/api/landbase-pemes" 201

PEME_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Created ID: $PEME_ID"

# READ
step "2. READ the created PEME"
api_call GET "$BASE_URL/api/landbase-pemes/$PEME_ID"
check_status GET "/api/landbase-pemes/$PEME_ID" 200

if echo "$HTTP_BODY" | grep -q '"last_name":"Reyes"'; then
    pass "Data integrity verified (last_name = Reyes)"
else
    fail "Data mismatch on read"
fi

# LIST
step "3. LIST all landbase PEMEs (paginated)"
api_call GET "$BASE_URL/api/landbase-pemes?page=0&size=5"
check_status GET "/api/landbase-pemes?page=0&size=5" 200

TOTAL=$(echo "$HTTP_BODY" | grep -o '"total_elements":[0-9]*' | cut -d: -f2)
info "Total elements: $TOTAL"

# UPDATE
step "4. UPDATE the PEME"
api_call PUT "$BASE_URL/api/landbase-pemes/$PEME_ID" '{
    "last_name": "Reyes",
    "first_name": "Pedro",
    "middle_name": "Lopez",
    "gender": "Male",
    "civil_status": "Married",
    "address": "321 Bonifacio St.",
    "contact_no": "09201234567",
    "nationality": "Filipino",
    "employer": "Land Construction Corp.",
    "position": "Senior Welder",
    "remarks": "Cleared for deployment"
}'
check_status PUT "/api/landbase-pemes/$PEME_ID" 200

if echo "$HTTP_BODY" | grep -q '"position":"Senior Welder"'; then
    pass "Update verified (position = Senior Welder)"
else
    fail "Update not reflected"
fi

# DELETE (not implemented)
step "5. DELETE the PEME (expect 405 - not implemented)"
api_call DELETE "$BASE_URL/api/landbase-pemes/$PEME_ID"
check_status DELETE "/api/landbase-pemes/$PEME_ID" 405

# =============================================================================
# Test: MLC Records
# =============================================================================
header "MLC RECORDS (/api/mlc-records)"

# CREATE
step "1. CREATE a new MLC record"
api_call POST "$BASE_URL/api/mlc-records" '{
    "last_name": "Garcia",
    "first_name": "Roberto",
    "middle_name": "Cruz",
    "gender": "Male",
    "civil_status": "Single",
    "address": "567 Mabini Ave.",
    "contact_no": "09211234567",
    "nationality": "Filipino",
    "employer": "Atlantic Shipping Inc.",
    "position": "Oiler",
    "vessel_name": "MV Pacific Star",
    "vessel_type": "Bulk Carrier",
    "rank": "Rating",
    "manning_agency": "Crewlink International"
}'
check_status POST "/api/mlc-records" 201

MLC_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Created ID: $MLC_ID"

# READ
step "2. READ the created MLC record"
api_call GET "$BASE_URL/api/mlc-records/$MLC_ID"
check_status GET "/api/mlc-records/$MLC_ID" 200

if echo "$HTTP_BODY" | grep -q '"last_name":"Garcia"'; then
    pass "Data integrity verified (last_name = Garcia)"
else
    fail "Data mismatch on read"
fi

# LIST
step "3. LIST all MLC records (paginated)"
api_call GET "$BASE_URL/api/mlc-records?page=0&size=5"
check_status GET "/api/mlc-records?page=0&size=5" 200

TOTAL=$(echo "$HTTP_BODY" | grep -o '"total_elements":[0-9]*' | cut -d: -f2)
info "Total elements: $TOTAL"

# UPDATE
step "4. UPDATE the MLC record"
api_call PUT "$BASE_URL/api/mlc-records/$MLC_ID" '{
    "last_name": "Garcia",
    "first_name": "Roberto",
    "middle_name": "Cruz",
    "gender": "Male",
    "civil_status": "Single",
    "address": "567 Mabini Ave.",
    "contact_no": "09211234567",
    "nationality": "Filipino",
    "employer": "Atlantic Shipping Inc.",
    "position": "Motorman",
    "vessel_name": "MV Pacific Star",
    "vessel_type": "Bulk Carrier",
    "rank": "Rating",
    "manning_agency": "Crewlink International",
    "fitness_determination": "Fit for Sea Duty"
}'
check_status PUT "/api/mlc-records/$MLC_ID" 200

if echo "$HTTP_BODY" | grep -q '"position":"Motorman"'; then
    pass "Update verified (position = Motorman)"
else
    fail "Update not reflected"
fi

# DELETE (not implemented)
step "5. DELETE the MLC record (expect 405 - not implemented)"
api_call DELETE "$BASE_URL/api/mlc-records/$MLC_ID"
check_status DELETE "/api/mlc-records/$MLC_ID" 405

# =============================================================================
# Test: Panama Certificates
# =============================================================================
header "PANAMA CERTIFICATES (/api/panama-certificates)"

# CREATE
step "1. CREATE a new Panama certificate"
api_call POST "$BASE_URL/api/panama-certificates" '{
    "full_name": "Roberto Garcia Cruz",
    "sex": "Male",
    "passport_seaman_no": "P123456789",
    "home_address": "567 Mabini Ave, Manila",
    "department": "Engine",
    "crew_position": "Oiler",
    "type_of_ship": "Tanker",
    "trade_area": "Worldwide",
    "height_cm": "170",
    "weight_kg": "75",
    "heart_rate": "72",
    "blood_pressure_systolic": "120",
    "blood_pressure_diastolic": "80"
}'
check_status POST "/api/panama-certificates" 201

PANAMA_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Created ID: $PANAMA_ID"

# READ
step "2. READ the created Panama certificate"
api_call GET "$BASE_URL/api/panama-certificates/$PANAMA_ID"
check_status GET "/api/panama-certificates/$PANAMA_ID" 200

if echo "$HTTP_BODY" | grep -q '"full_name":"Roberto Garcia Cruz"'; then
    pass "Data integrity verified (full_name = Roberto Garcia Cruz)"
else
    fail "Data mismatch on read"
fi

# LIST
step "3. LIST all Panama certificates (paginated)"
api_call GET "$BASE_URL/api/panama-certificates?page=0&size=5"
check_status GET "/api/panama-certificates?page=0&size=5" 200

TOTAL=$(echo "$HTTP_BODY" | grep -o '"total_elements":[0-9]*' | cut -d: -f2)
info "Total elements: $TOTAL"

# UPDATE
step "4. UPDATE the Panama certificate"
api_call PUT "$BASE_URL/api/panama-certificates/$PANAMA_ID" '{
    "full_name": "Roberto Garcia Cruz",
    "sex": "Male",
    "passport_seaman_no": "P123456789",
    "home_address": "567 Mabini Ave, Manila",
    "department": "Engine",
    "crew_position": "Motorman",
    "type_of_ship": "Tanker",
    "trade_area": "Worldwide",
    "height_cm": "170",
    "weight_kg": "76",
    "heart_rate": "70",
    "blood_pressure_systolic": "118",
    "blood_pressure_diastolic": "78",
    "fitness_restriction": "None"
}'
check_status PUT "/api/panama-certificates/$PANAMA_ID" 200

if echo "$HTTP_BODY" | grep -q '"crew_position":"Motorman"'; then
    pass "Update verified (crew_position = Motorman)"
else
    fail "Update not reflected"
fi

# DELETE (not implemented)
step "5. DELETE the Panama certificate (expect 405 - not implemented)"
api_call DELETE "$BASE_URL/api/panama-certificates/$PANAMA_ID"
check_status DELETE "/api/panama-certificates/$PANAMA_ID" 405

# =============================================================================
# Test: Error Handling
# =============================================================================
header "ERROR HANDLING TESTS"

# 404 - Not Found
step "1. GET non-existent resource (expect 404)"
api_call GET "$BASE_URL/api/profiles/00000000-0000-0000-0000-000000000000"
check_status GET "/api/profiles/00000000-..." 404

# 400 - Validation Error (missing required field)
step "2. POST without required field (expect 400)"
api_call POST "$BASE_URL/api/profiles" '{"first_name": "NoLastName"}'
check_status POST "/api/profiles (no last_name)" 400

# 400 - Invalid JSON body
step "3. POST with malformed JSON (expect 400)"
api_call POST "$BASE_URL/api/profiles" '{ invalid json }'
check_status POST "/api/profiles (bad json)" 400

# =============================================================================
# Summary
# =============================================================================
echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN}  TEST SUMMARY${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo ""
echo -e "  ${GREEN}Passed: $PASS${NC}"
echo -e "  ${RED}Failed: $FAIL${NC}"
echo -e "  Total:  $((PASS + FAIL))"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo -e "  ${GREEN}All tests passed!${NC}"
    echo ""
    echo -e "  Log saved to: ${GRAY}$LOG_FILE${NC}"
    echo -e "  Responses saved to: ${GRAY}$LOG_FILE.responses${NC}"
    exit 0
else
    echo -e "  ${RED}Some tests failed. Check output above.${NC}"
    echo ""
    echo -e "  Log saved to: ${GRAY}$LOG_FILE${NC}"
    echo -e "  Responses saved to: ${GRAY}$LOG_FILE.responses${NC}"
    exit 1
fi
